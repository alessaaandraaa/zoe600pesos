const API_ROOT = "https://my-proxy.24100314.workers.dev";

export function apiGet(path, params = {}) {
  return new Promise((resolve, reject) => {
    const url = API_ROOT + path + "?" + new URLSearchParams(params);
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Accept", "application/json");

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        console.log("Raw response:", xhttp.responseText);
        if (xhttp.status >= 200 && xhttp.status < 300) {
          try {
            resolve(JSON.parse(xhttp.responseText));
          } catch (err) {
            reject(new Error("Invalid JSON: " + err.message));
          }
        } else {
          reject(new Error("Request failed: " + xhttp.status));
        }
      }
    };

    xhttp.send();
  });
}

export function apiSend(method, path, body = {}) {
  return new Promise((resolve, reject) => {
    const url = API_ROOT + path;
    const xhttp = new XMLHttpRequest();

    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        console.log("Raw response:", xhttp.responseText);
        if (xhttp.status >= 200 && xhttp.status < 300) {
          try {
            resolve(JSON.parse(xhttp.responseText));
          } catch (err) {
            reject(new Error("Invalid JSON: " + err.message));
          }
        } else {
          reject(new Error("Request failed: " + xhttp.status));
        }
      }
    };

    xhttp.send(JSON.stringify(body));
  });
}
