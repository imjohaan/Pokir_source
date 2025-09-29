/**
 * Replace roblox.com with our url
 * @param {string} data 
 * @param {string} newUrl
 */
const replacer = (data, newUrl) => {
    let urlNoPort = newUrl;
    if (urlNoPort.indexOf(':') !== -1) {
        urlNoPort = urlNoPort.slice(0, urlNoPort.indexOf(':'));
    }
   return data
  // Cubre subdominios como www, api, games, setup, etc.
  .replace(/https?:\/\/([a-z0-9-]+)\.roblox\.com/gi, `${newUrl}/apisite/$1`)
  // Cubre dominio raíz roblox.com
  .replace(/https?:\/\/roblox\.com/gi, newUrl)
  // Cubre el localhost que usa internamente
  .replace(/https:\/\/localhost/gi, 'http://' + urlNoPort);
}

module.exports = replacer;

