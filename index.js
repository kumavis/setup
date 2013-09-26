module.exports = function() {
  
  var setup = {
    network: {},
    hostname: {},
    hosts: {},
    crontab: {},
    clock: {},
  };

  // Hostname
  setup.hostname.save = function(hostname,outFile) {
    require('fs').writeFileSync(outFile || '/etc/hosts', hostname);
  }

  // Hosts
  setup.hosts.save = function(config,outFile) {
    require('fs').writeFileSync(outFile || '/etc/hosts', config);
  }
  setup.hosts.config = function(hosts) {
    var output = [];
    for (ip in hosts) output.push(ip+'  '+hosts[ip]);
    return output.join("\n");
  }

  // Date/Time
  setup.clock.set = function(time) {
    require('child_process').exec('date -s "'+time+'" ; hwclock --systohc;', cb);
  }

  // Networking
  setup.network.restart = function(cb) {
    require('child_process').exec('/etc/init.d/networking restart', cb);
  }
  setup.network.save = function(config,outFile) {
    require('fs').writeFileSync(outFile || '/etc/network/interfaces', config);
  }
  setup.network.config = function(config) {
    var output= [];

    output.push('auto lo')
    output.push('iface lo inet loopback')

    for (device in config) {
      output.push('')

      if (config[device].auto)
        output.push('auto '+device)

      if (config[device].dhcp == true)
        output.push('iface '+device+' inet dhcp')
      else
        output.push('iface '+device+' inet static')

      if (config[device].wireless) {
        if (config[device].wireless.ssid)
          output.push('  wpa-ssid '+config[device].wireless.ssid)
        if (config[device].wireless.psk)
          output.push('  wpa-psk '+config[device].wireless.psk)
      }

      if (config[device].ipv4) {
        if (config[device].ipv4.address)
          output.push('address '+config[device].ipv4.address)

        if (config[device].ipv4.netmask)
          output.push('netmask '+config[device].ipv4.netmask)

        if (config[device].ipv4.gateway)
          output.push('gateway '+config[device].ipv4.gateway)

        if (config[device].ipv4.dns)
          output.push('dns-nameservers '+config[device].ipv4.dns)                
      }

    }
    return output.join("\n");
  }

  return setup;
}