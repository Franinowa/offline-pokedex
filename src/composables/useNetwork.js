import { ref } from 'vue';

const isOnline = ref(window.navigator.onLine);
console.log('online: ', window.navigator.onLine);

export function useNetwork() {
    window.addEventListener('online', () => {
        isOnline.value = true;
    });
   
    window.addEventListener('offline', () => {
        isOnline.value = false;
    });

    return {
        isOnline,
    };
}