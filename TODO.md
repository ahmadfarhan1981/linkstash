TODO
* global
  * LOGGING
  * Integrations
    * paperless-ngx
    * ytdl/metube/etc
    * 
  * darkmode +global
  * finalize color scheme
  * biome instead of eslint
  * group links by domain
  * find duplicate link
  * 
* frontend
  * url param for curent page, page size, filtering and sorting
  * secodary sort criteria url when no title. and just in general tiebreakers to make it deteministic
  * refactor bookmarks page
  * styling for filter and paging
  * finish bookmark card
    * archive
    * delete
    * edit
    * 
  * tag filter
  * input components
  * NextJS routing best practice
    * loading.js https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
    * use parallel modal for login https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals
    * 
  * archive button
  * view archive
  * better error handling
* backend 
  * LOGGING
  * Updating tags
    * Updating bookmarks when tags are edited
  * how to handle composite index for archive and assets
    * Probly just handle in mysql and have a migrate script for the db structure
  * Scheduler for the archiving
  * usehooks better
    * use custom hooks for context
    * use custome hooks better in general
      * [custom hook eleraning](https://www.linkedin.com/learning/react-hooks/reusing-form-logic-with-custom-hooks?autoSkip=true&dApp=206046736&resume=false&u=2092596)
  * fetching favicons, might as well move OGS and the whole fetching URL metadata to server side?
