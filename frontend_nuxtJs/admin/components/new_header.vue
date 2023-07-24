<template>
    <header class="page-header">
  <nav>
    <a href="#0" aria-label="forecastr logo" class="logo">
      <svg width="140" height="49">
        <use xlink:href="#logo"></use>
      </svg>
    </a>
    <button class="toggle-mob-menu" aria-expanded="false" aria-label="open menu">
      <svg width="20" height="20" aria-hidden="true">
        <use xlink:href="#down"></use>
      </svg>
    </button>
    <ul class="admin-menu">
      <li class="menu-heading">
        <h3>Admin</h3>
      </li>
      <li>
        <nuxt-link to="/admin"><span>Главная</span></nuxt-link>
      </li>
      <li>
        <nuxt-link to="/admin/orders"><span>Заказы</span></nuxt-link>
      </li>
      <li>
        <nuxt-link to="/admin/delivery"><span>Доставки</span></nuxt-link>
      </li>
      <li>
        <nuxt-link to="/admin/news"><span>Новости</span></nuxt-link>
      </li>
      <li>
        <nuxt-link no-prefetch to="/admin/news/create">
          <svg>
            <use xlink:href="#trends"></use>
          </svg>
        <span>Создать новость</span>
      </nuxt-link>
      </li>
      <li>
        <a href="#0">
          <svg>
            <use xlink:href="#collection"></use>
          </svg>
          <span>Collection</span>
        </a>
      </li>
      <li>
        <a href="#0">
          <svg>
            <use xlink:href="#comments"></use>
          </svg>
          <span>Comments</span>
        </a>
      </li>
      <li>
        <a href="#0">
          <svg>
            <use xlink:href="#appearance"></use>
          </svg>
          <span>Appearance</span>
        </a>
      </li>
      <li class="menu-heading">
        <h3>Settings</h3>
      </li>
      <li>
        <a href="#0">
          <svg>
            <use xlink:href="#settings"></use>
          </svg>
          <span>Settings</span>
        </a>
      </li>
      <li>
        <a href="#0">
          <svg>
            <use xlink:href="#options"></use>
          </svg>
          <span>Options</span>
        </a>
      </li>
      <li>
        <a href="#0">
          <svg>
            <use xlink:href="#charts"></use>
          </svg>
          <span>Charts</span>
        </a>
      </li>
      <li>
        <div class="switch">
          <input type="checkbox" id="mode" checked>
          <label for="mode">
            <span></span>
            <span>Dark</span>
          </label>
        </div>
        <button class="collapse-btn" aria-expanded="true" aria-label="collapse menu">
          <svg aria-hidden="true">
            <use xlink:href="#collapse"></use>
          </svg>
          <span>Collapse</span>
        </button>
      </li>
    </ul>
  </nav>
</header>
</template>

<style src="~/assets/styles/new.css"  scoped>
</style>

<script>
export default {
    setup() {
        
    },
    mounted(){
      const html = document.documentElement;
const body = document.body;
const menuLinks = document.querySelectorAll(".admin-menu a");
const collapseBtn = document.querySelector(".admin-menu .collapse-btn");
const toggleMobileMenu = document.querySelector(".toggle-mob-menu");
const switchInput = document.querySelector(".switch input");
const switchLabel = document.querySelector(".switch label");
const switchLabelText = switchLabel.querySelector("span:last-child");
const collapsedClass = "collapsed";
const lightModeClass = "light-mode";

/*TOGGLE HEADER STATE*/
collapseBtn.addEventListener("click", function () {
  body.classList.toggle(collapsedClass);
  this.getAttribute("aria-expanded") == "true"
    ? this.setAttribute("aria-expanded", "false")
    : this.setAttribute("aria-expanded", "true");
  this.getAttribute("aria-label") == "collapse menu"
    ? this.setAttribute("aria-label", "expand menu")
    : this.setAttribute("aria-label", "collapse menu");
});

/*TOGGLE MOBILE MENU*/
toggleMobileMenu.addEventListener("click", function () {
  body.classList.toggle("mob-menu-opened");
  this.getAttribute("aria-expanded") == "true"
    ? this.setAttribute("aria-expanded", "false")
    : this.setAttribute("aria-expanded", "true");
  this.getAttribute("aria-label") == "open menu"
    ? this.setAttribute("aria-label", "close menu")
    : this.setAttribute("aria-label", "open menu");
});

/*SHOW TOOLTIP ON MENU LINK HOVER*/
for (const link of menuLinks) {
  link.addEventListener("mouseenter", function () {
    if (
      body.classList.contains(collapsedClass) &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      const tooltip = this.querySelector("span").textContent;
      this.setAttribute("title", tooltip);
    } else {
      this.removeAttribute("title");
    }
  });
}

/*TOGGLE LIGHT/DARK MODE*/
if (localStorage.getItem("dark-mode") === "false") {
  html.classList.add(lightModeClass);
  switchInput.checked = false;
  switchLabelText.textContent = "Light";
}

switchInput.addEventListener("input", function () {
  html.classList.toggle(lightModeClass);
  if (html.classList.contains(lightModeClass)) {
    switchLabelText.textContent = "Light";
    localStorage.setItem("dark-mode", "false");
  } else {
    switchLabelText.textContent = "Dark";
    localStorage.setItem("dark-mode", "true");
  }
});

    }
}
</script>