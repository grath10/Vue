## Features

- Login/Logout
- Permission authentication
- Sidebar
- Breadcrumb
- Rich text editor
- Markdown editor
- JSON editor
- Drag & drop list
- SplitPane
- Dropzone
- Sticky
- CountTo
- ECharts
- 401, 404 error page
- Error log
- Export Excel
- Upload Excel
- Export Zip
- Table example
- Interactive table example
- Drag & drop table example
- Form example
- Multi-environments distribution
- Dashboard
- Two-factor authentication
- Collapsing sidebar (support nested routes)
- Mock data
- cache tabs example
- screenfull
- markdown2html
- views-tab
- clipboard

## Directory structure

```
├── build                      // build 
├── config                     // config
├── src                        // source code
│   ├── api                    // all requests
│   ├── assets                 // static resource like themes, fonts
│   ├── components             // global public components
│   ├── directive              // global directive
│   ├── filters                // global filters
│   ├── mock                   // mock data
│   ├── router                 // router
│   ├── store                  // global status management
│   ├── styles                 // global styles
│   ├── utils                  // global public functions
│   ├── view                   // view
│   ├── App.vue                // entry view
│   └── main.js                // entry for loading components, initialization
├── static                     // third-party libraries not packed with Webpack
│   └── Tinymce                // rich text
├── .babelrc                   // babel-loader config
├── eslintrc.js                // eslint config
├── .gitignore                 // gitignore
├── favicon.ico                // favicon
├── index.html                 // html template
└── package.json               // package.json