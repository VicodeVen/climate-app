/*
Desafío: cree una aplicación meteorológica utilizando una API. Utilice bibliotecas de front-end como React o Vue. No mire la solución existente. Cumplir con las historias de usuario a continuación:

Historia de usuario: puedo ver el clima de la ciudad de forma predeterminada, preferiblemente mi ubicación actual
Historia de usuario: puedo buscar ciudad
Historia de usuario: puedo ver el clima de hoy y los próximos 5 días
Historia de usuario: puedo ver la fecha y la ubicación del clima
Historia de usuario: puedo ver según la imagen para cada tipo de clima
Historia de usuario: puedo ver el grado mínimo y máximo cada día
Historia de usuario: puedo ver el estado y la dirección del viento
Historia de usuario: puedo ver el porcentaje de humedad
Historia de usuario: puedo ver un indicador de visibilidad
Historia de usuario: puedo ver el número de presión de aire
Historia de usuario (opcional): puedo solicitar el clima de mi ubicación actual
Historia de usuario (opcional): puedo convertir la temperatura en grados Celsius a Fahrenheit y viceversa
*/

const d = document,
      loader = d.querySelector('.loader'),
      cardCero = d.getElementById('card0'),
      cardUno = d.getElementById('card1'),
      cardDos = d.getElementById('card2'),
      cardTres = d.getElementById('card3'),
      cardCuatro = d.getElementById('card4'),

      cardList = [cardCero, cardUno, cardDos, cardTres, cardCuatro],

      dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'] 

d.addEventListener('click', (e) => {
  
  if(e.target.matches('.btn-search-places')) {
    console.log(e.target)
    d.documentElement.style.setProperty('--translateSidebar', '0px')
  }
  
  if(e.target.matches('.btn-search')) {
    e.preventDefault()

    rendering(`https://www.metaweather.com/api/location/search/?query=${d.querySelector('.input-search').value}`) 
  }
 
  if(e.target.matches('.close')) {
    d.documentElement.style.setProperty('--translateSidebar', '-380px')
  }

  if(e.target.matches('.geo')) {
    console.log('Hola soy el boton de Geolocation c:')  
    getGeolocation()    
  }

})



function getGeolocation() {

  options={
    enableHightAccuracy:true,
    timeout:10000,
    maximumAge:0
  }

  const success = (position) => {
   const coords = position.coords
    rendering(`https://www.metaweather.com/api/location/search/?lattlong=${coords.latitude},${coords.longitude}`)  
  }

  const error = (err) => {
    console.log(err)
  }

  navigator.geolocation.getCurrentPosition(success,error,options)

}




function rendering (url) {
      const value = d.querySelector('.input-search').value    
      let secondPart = value.slice(1,20).toLowerCase()
      let inputFinally = `${value.charAt(0).toUpperCase()}${secondPart}`
      const URL_API = url
      const URL_IMAGE = 'https://www.metaweather.com/static/img/weather/png/'
  
      if(inputFinally.startsWith('San',0) || inputFinally.startsWith('El',0)) {

      let primaryLetter = inputFinally.slice(inputFinally.indexOf(' '),20)    
  
      inputFinally = inputFinally.startsWith('San') 
      ?`San ${primaryLetter.charAt(1).toUpperCase()}${primaryLetter.slice(2,20)}`
      :`El ${primaryLetter.charAt(1).toUpperCase()}${primaryLetter.slice(2,20)}`
}

  async function getData () {
      
    const response  = await fetch(URL_API)
    const data = await response.json()
   
    data.forEach(el => {
        if(el.title === inputFinally || el.distance < 1000000 ) {
          
             fetch(`https://www.metaweather.com/api/location/${el.woeid}/`)
            .then(res => res.json())
            .then(data => {
              console.log(data)
		    
              if(response.status >= 200 && response.status < 300) {
                
                loader.style.display= 'none'

                //SEARCHING
                
                d.getElementById('icon-sidebar').src = `${URL_IMAGE}${data.consolidated_weather[0].weather_state_abbr}.png`
              
                d.getElementById('temperature').innerHTML = `<strong>${Math.floor(data.consolidated_weather[0].the_temp)}</strong><span class="attri">°c</span>`
                
                d.getElementById('temperature-text').textContent = `${data.consolidated_weather[0].weather_state_name}`
                
                d.getElementById('ubication').innerHTML = `<img src="/assets/ubication.svg" alt=""> ${data.title}`
                
                }
		    //BODY-HEADER
		    cardList.map((el,i) => {
			  
			    el.innerHTML = `
			    <p class="fecha-card${i}">${dayOfWeek[i]}</p>
			    <img src="${URL_IMAGE}${data.consolidated_weather[i].weather_state_abbr}.png" alt="" class="icon-card">
			    <div class="temperature-card">
                            <p class="min-temp-card" id="card-5">${Math.floor(data.consolidated_weather[i].min_temp)}°</p>
			    <p class="max-temp-card">${Math.floor(data.consolidated_weather[i].max_temp)}°</p>
			    </div>
			    `
			    d.querySelector('.grid-header').appendChild(el)
		    })
		    
              //BODY-DASHBOARD
            d.getElementById('humidity-data').innerHTML = `
              ${data.consolidated_weather[0].humidity}<span class="attr">%</span>
                `;
            d.documentElement.style.setProperty('--humidityBar','yellow')  
            d.documentElement.style.setProperty('--humidityBarWidth', `${data.consolidated_weather[0].humidity * 2}px`)
              
            d.getElementById('wind-status-data').innerHTML = `
              ${Math.floor(data.consolidated_weather[0].wind_speed)}<span class="attr">mph</span>
                `;
          
            d.getElementById('visibility-data').innerHTML = `
              ${Math.floor(data.consolidated_weather[0].visibility)} <span class="attr"> miles</span>
                `;
            
            d.getElementById('air-pressure-data').innerHTML = `
              ${Math.floor(data.consolidated_weather[0].air_pressure)} <span class="attr"> mb</span>
                `;
	    })
        }
    })
}
getData()
}

d.addEventListener('DOMContentLoaded', () => {

    getGeolocation()    

})

