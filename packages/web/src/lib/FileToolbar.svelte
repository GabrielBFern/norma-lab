<script>
    import { clickOutside } from "../clickOutside";

    export let menuItems = [];

    let selectedItem = null;
    let subMenuOpen = false;
    let subMenuItems = [];

    const handleClickOutside = () => {
        subMenuOpen = false;
        selectedItem = null;
        subMenuItems = [];
    };

    const handleClick = (event, menuItem) => {
        event.preventDefault();

        // If the clicked menu item is already selected, close the submenu if it's open
        if (menuItem === selectedItem && subMenuOpen) {
            subMenuOpen = false;
            subMenuItems = [];
            return;
        }

        // Close any open submenu
        subMenuOpen = false;
        subMenuItems = [];

        // If the clicked menu item has items, open the submenu
        if (menuItem.items && menuItem.items.length) {
            subMenuOpen = true;
            selectedItem = menuItem;
            subMenuItems = menuItem.items;
        } else {
            selectedItem = menuItem;
        }
    };

    const handleSubMenuClick = (event, subMenuItem) => {
        event.preventDefault();
        if (subMenuItem.fn !== null) subMenuItem.fn();
        selectedItem = subMenuItem;
        subMenuOpen = false;
        subMenuItems = [];
    };
</script>

<div use:clickOutside on:outsideclick={handleClickOutside} class="vscode-menu">
    {#each menuItems as menuItem}
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
            href="#"
            class:selected={menuItem === selectedItem}
            on:click={(e) => handleClick(e, menuItem)}
        >
            {menuItem.label}
            {#if menuItem.items && menuItem.items.length}
                <span class="submenu-icon"
                    >{subMenuOpen && menuItem === selectedItem
                        ? "▼"
                        : "▶"}</span
                >
            {/if}
            {#if subMenuOpen && subMenuItems.length}
                <div class="submenu" class:drop={menuItem === selectedItem}>
                    {#each subMenuItems as subMenuItem}
                        <a
                            href="#"
                            class:selected={subMenuItem === selectedItem}
                            on:click={(e) => handleSubMenuClick(e, subMenuItem)}
                        >
                            {subMenuItem.label}
                        </a>
                    {/each}
                </div>
            {/if}
        </a>
    {/each}
</div>

<style>
    .vscode-menu {
        display: flex;
        gap: 1rem;
        border: 1px solid #ddd;
        padding: 0.5rem;
        border-radius: 0.25rem 0.25rem 0 0;
    }

    a {
        color: #666;
        text-decoration: none;
        padding: 0.25rem;
    }

    a:hover {
        background-color: #ddd;
    }

    .selected {
        color: #fff;
        background-color: #007acc;
        border-radius: 0.25rem;
    }

    .submenu {
        position: absolute;
        background-color: #fff;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 0.25rem 0.25rem;
        padding: 0.25rem;
        z-index: 1;
        display: none;
    }

    .drop {
        display: inline-block;
    }

    .submenu a {
        display: block;
        padding: 0.25rem;
    }

    .submenu a:hover {
        background-color: #ddd;
    }

    .submenu-icon {
        right: 0.25rem;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
