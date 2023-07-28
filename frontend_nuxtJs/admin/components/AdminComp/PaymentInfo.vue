<template>
    <div>
      <p>Статус оплаты: {{ payment.status }}</p>
  
    </div>
  </template>
  
  <style src="~/assets/styles/new.css"  scoped>
  </style>
  <script>
  export default {
      props:['payment']
  }
  </script>
  
  <style>
  
  </style>