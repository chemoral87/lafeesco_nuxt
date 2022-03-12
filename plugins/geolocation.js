//https://serversideup.net/packaging-a-nuxtjs-app-for-ios-and-android-with-capacitorjs/
//https://capacitorjs.com/blog/integrating-capacitorjs-plugins-with-nuxtjs
// https://capacitorjs.com/
// https://serversideup.net/packaging-a-nuxtjs-app-for-ios-and-android-with-capacitorjs/
import { Geolocation } from "@capacitor/geolocation";

// const { Geolocation } = Geolocation;

export default function({ app }, inject) {
  inject("CapacitorGeolocation", Geolocation);
}
