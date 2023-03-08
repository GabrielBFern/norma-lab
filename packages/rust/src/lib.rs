mod utils;

use norma_machine_rs::{error::NormaMachineError, NormaMachine};
use norma_machine_rs::{Context, NormaProgram};

use pest::error::LineColLocation;
use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: String);

    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Default)]
#[wasm_bindgen]
pub struct NormaInstance {
    program: Option<NormaProgram>,
}

/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl NormaInstance {
    pub fn new() -> NormaInstance {
        utils::set_panic_hook();
        NormaInstance::default()
    }

    #[wasm_bindgen(js_name = "change_source")]
    pub fn change_source(&mut self, src: String) -> JsValue {
        match NormaProgram::parse(&src) {
            Ok(prg) => {
                self.program = Some(prg);
                JsValue::null()
            }
            Err(NormaMachineError::EmptySource) => {
                let error = ParseError {
                    message: "Empty source".to_owned(),
                    start: (0, 0),
                    end: (0, 0),
                };
                serde_wasm_bindgen::to_value(&error).unwrap()
            }
            Err(NormaMachineError::Parse(err)) => {
                let (start, end) = match err.line_col {
                    LineColLocation::Pos(start) => (start, start),
                    LineColLocation::Span(start, end) => (start, end),
                };
                let error = ParseError {
                    message: format!("{err}"),
                    start,
                    end,
                };
                serde_wasm_bindgen::to_value(&error).unwrap()
            }
        }
    }

    #[wasm_bindgen(js_name = "prepareMachine")]
    pub fn prepare_machine(&self) -> Option<WrappedNormaMachine> {
        Some(WrappedNormaMachine {
            machine: NormaMachine::new(self.program.clone().unwrap()),
        })
    }

    #[wasm_bindgen(js_name = "run")]
    pub fn run(fonte: String, f: &js_sys::Function) {
        match NormaProgram::parse(&fonte) {
            Ok(prg) => {
                let mut machine = NormaMachine::new(prg);
                while machine.run_bound().is_some() {
                    update_registers(machine.get_context(), f);
                }
            }
            Err(_) => {
                alert("Fonte não está compilando".into());
            }
        }
    }
}

#[wasm_bindgen]
pub struct WrappedNormaMachine {
    machine: NormaMachine,
}

#[wasm_bindgen]
impl WrappedNormaMachine {
    #[wasm_bindgen]
    pub fn run(&mut self, reg_update: &js_sys::Function) {
        while self.machine.run_bound().is_some() {
            update_registers(self.machine.get_context(), reg_update);
        }
    }

    #[wasm_bindgen(js_name = "runBound")]
    pub fn run_bound(&mut self, steps: usize, reg_update: &js_sys::Function) -> bool {
        for _try in 1..steps {
            if self.machine.run_bound().is_none() {
                update_registers(self.machine.get_context(), reg_update);
                return false;
            };
        }
        update_registers(self.machine.get_context(), reg_update);
        true
    }

    #[wasm_bindgen(js_name = "nextDebug")]
    pub fn next_debug(&mut self, reg_update: &js_sys::Function, line_update: &js_sys::Function) {
        self.machine.run_bound();
        update_registers(self.machine.get_context(), reg_update);
        update_cursor(self.machine.get_context(), line_update);
    }
}

fn update_registers(ctx: &Context, f: &js_sys::Function) {
    let this = JsValue::null();
    for (register, value) in &ctx.get_registers() {
        let register = JsValue::from(register);
        let value = JsValue::from(value.to_string());
        let _ = f.call2(&this, &register, &value);
    }
}

pub fn update_cursor(ctx: &Context, f: &js_sys::Function) {
    let this = JsValue::null();
    let value = JsValue::from(ctx.get_cursor());
    let _ = f.call1(&this, &value);
}

#[derive(Serialize, Deserialize)]
pub struct ParseError {
    message: String,
    start: (usize, usize),
    end: (usize, usize),
}

#[wasm_bindgen(js_name = "parse")]
pub fn parse(fonte: String) -> JsValue {
    if let Err(NormaMachineError::Parse(err)) = NormaProgram::parse(&fonte) {
        let (start, end) = match err.line_col {
            LineColLocation::Pos(start) => (start, start),
            LineColLocation::Span(start, end) => (start, end),
        };
        let error = ParseError {
            message: format!("{err}"),
            start,
            end,
        };
        serde_wasm_bindgen::to_value(&error).unwrap()
    } else {
        JsValue::null()
    }
}
