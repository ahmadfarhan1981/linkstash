# Security considerations

LinkStash was designed with functionality as the primary focus, and security was not a primary concern during its development. While we strive to adhere to best practices, users should exercise caution and perform due diligence when considering internet exposure.

For safer access, we strongly recommend connecting to LinkStash via a VPN solution, such as WireGuard or Tailscale, to securely access your network. This approach minimizes exposure and reduces the risk of unauthorized access.

If you must expose LinkStash to the internet, ensure proper security measures are in place:
- Use a reverse proxy to mediate traffic.
- Implement authentication at the reverse proxy level to safeguard the application.

These steps will help mitigate potential risks and enhance the security of your deployment.These are just general advice and are not in scope of this document or this project. 

