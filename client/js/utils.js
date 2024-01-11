window.addEventListener("DOMContentLoaded", () => {
  
});
function navigateTo(destination , urlParams = null) {
  if(urlParams)
  {
    destination += "?";
    for (const [key, value] of Object.entries(urlParams)) {
      destination += `${key}=${value}&`;
    }
  }
  window.location.href = destination;
}