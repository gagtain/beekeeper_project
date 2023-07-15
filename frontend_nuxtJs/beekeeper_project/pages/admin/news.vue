<template>
    
    <div class="container-fluid">
           <div class="row">
      <div class="col-md-4 col-lg-3 navbar-container bg-light">
        <!-- Вертикальное меню -->
        <nav class="navbar navbar-expand-md navbar-light">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbar">
            <!-- Пункты вертикального меню -->
            <ul class="navbar-nav">
              <li class="nav-item">
              <a class="nav-link" href="#link-1">Ссылка 1</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="#link-2">Ссылка 2</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="#link-3">Ссылка 3</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="#link-4">Ссылка 4</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="#link-5">Ссылка 5</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="col-md-8 col-lg-9 content-container" style="background-color: #ffe0b2">
        <!-- Основной контент страницы  -->
        ...
      </div>
    </div>
  </div>
</template>
<style>
@media (min-width: 768px) {
  .navbar-container {
    position: sticky;
    top: 0;
    overflow-y: auto;
    height: 100vh;
  }
  .navbar-container .navbar {
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: nowrap;
    flex-direction: column;
    height: 100%;
  }
  .navbar-container .navbar-collapse {
    align-items: flex-start;
  }
  .navbar-container .nav {
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .navbar-container .navbar-nav {
    flex-direction: column !important;
  }
}
</style>

<script>

export default{
    
}

</script>