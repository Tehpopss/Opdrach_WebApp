import _ from 'lodash';
import './style.css';
import Markt from './Markt_Wervik.jpg'
import Icon from './icon.png';
import printMe from './print.js';

  document.body.appendChild(component());

if ('serviceWorker' in navigator) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

const applicationServerPublicKey = 'BFJDrFie8EYYehn6zPpxjr1LOy8auDg1U8fIR-C3V19KfXRYFeyz413SEvzuwXhdZSs5ARZ9YAHFR-nxObuh8UU';

let isSubscribed = false;
let swRegistration = null;

const pushButton = document.querySelector('button');

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
    if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);
    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}



function component() {
    const element = document.createElement('div');

    const img = document.createElement('img');
    img.src = Markt;
    element.appendChild(img);

    const btn = document.createElement('button');

    const p = document.createElement('p');
    p.innerHTML = _.join(['Wekelijkse markt Wervik'],' ');

    element.appendChild(p);
    const ul = document.createElement('ul');

    const li = document.createElement('li');
    const li1 = document.createElement('li');
    const li2 = document.createElement('li');
    li.innerHTML = _.join (['elke vrijdag tussen 8 en 12 uur'],' ');
    li1.innerHTML = _.join (['Steenakker (45 staanplaatsen) en Sint-Maartensplein (4 plaatsen)'],' ');
    li2.innerHTML = _.join ([' Ook op de Sint-Denijsplaats in Geluwe (4 staanplaatsen) zijn op vrijdagmorgen enkele plaatsen voorbehouden voor marktkramers die voeding verkopen'],' ');
    
    ul.appendChild(li);
    ul.appendChild(li1);
    ul.appendChild(li2);
    element.appendChild(ul);

    btn.innerHTML = 'Push Button!';
    btn.onclick = updateBtn;

    element.appendChild(btn);

    return element;
  }
  
