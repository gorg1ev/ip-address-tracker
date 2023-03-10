const form = document.querySelector('.header__form');
const addressDomain = form.querySelector('input');
const info = document.querySelectorAll('.header__info-item p');
const Map = document.getElementById('map');
let map;

const ipRegEx =
   /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const domainRegEx = /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/;

form.addEventListener('submit', (e) => {
   e.preventDefault();

   let inputParameters;

   if (ipRegEx.test(addressDomain.value)) inputParameters = 'ipAddress';
   if (domainRegEx.test(addressDomain.value)) inputParameters = 'domain';

   if (!inputParameters) return;

   fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_Ff6ol7BfjO875KuECgYaKOUxfyVEL&${inputParameters}=${addressDomain.value}`
   )
      .then((res) => res.json())
      .then((data) => {
         addressDomain.value = '';

         if (map && map.remove) {
            map.off();
            map.remove();
         }

         map = L.map(Map).setView([data.location.lat, data.location.lng], 13);
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
         }).addTo(map);
         L.marker([data.location.lat, data.location.lng]).addTo(map);

         console.log(data);
         info[0].textContent = data.ip;
         info[1].textContent = data.location.city;
         info[2].textContent = `UTC ${data.location.timezone}`;
         info[3].textContent = data.isp;
      });
});
