
# Setup local Development

## Requirements

 * Node.js >= 16

## Portal

To start the Portal locally:

    cd portal
    npm install
    npm start

I this case the *portal/config/development* configuration is active and the
*remote-portal-apps.json* file contains the URLs of the locally running Microfrontends.

The Portal will be available at: [http://localhost:5050](http://localhost:5050).
You can login as admin/admin or john/john.

## Start the Microfrontends in dev mode

     cd microfrontend-demo1
     npm install
     npm run dev

     cd microfrontend-demo2
     npm install
     npm run dev

The Microfrontend are available at [http://localhost:6088](http://localhost:6088) and [http://localhost:6089](http://localhost:6089)
and they will automatically reload on code changes.

### Portal integration

When you open [http://localhost:5050/mashroom/admin/ext/remote-portal-apps](http://localhost:5050/mashroom/admin/ext/remote-portal-apps) you
should see now the running Microfrontends.
You can add them on arbitrary Portal pages, but you have to hit F5 to see changes in the Microfrontends.
