const tailwindcss = require('tailwindcss')

// module.exports = {
//     plugins:[
//         tailwindcss('./tailwind.js'), // the directory of the config file we created 
//         require('autoprefixer')
//     ],
//     content: ['./src/App.js'],
// }

module.exports = {
    plugins:[
        tailwindcss('./tailwind.js'), // the directory of the config file we created 
        require('autoprefixer')
    ],
    content: [
        './src/**/*.html',
        './src/**/*.js',
        './public/**/*.html',
        './public/**/*.js',
        './src/*.html',
        './src/*.js',
        './public/*.html',
        './public/*.js'
      ],
      theme: {
        extend: {
            backgroundImage: {
                "rain" : "https://giffiles.alphacoders.com/105/105273.gif",
            }
        },
      },
      
    // ...
  }
