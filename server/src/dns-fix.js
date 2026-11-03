import dns from 'node:dns'

// Atlas (+srv) lookup ke liye Google/Cloudflare DNS
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
dns.setDefaultResultOrder('ipv4first')