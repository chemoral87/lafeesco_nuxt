export default function (context) {
  // Ensure we are on client side
  if (process.client) {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.returnValue = 'Realmente desea salir?';
      // return 'Pressing the Back button may result in your payment being processed again and your order not being processed properly.';
    });
  }
}
