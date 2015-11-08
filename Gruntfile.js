module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= pkg.version %>'
            },
            {
              match: 'timestamp',
              replacement: '<%= grunt.template.today() %>'
            },
            {
              match: /sfafx_parser = \(function\(\) {/g,
              replacement: 'SFAFx.sfafx_parser = (function(SFAFx) {'
            },
            {
              match: /parse\n\s*};\n}\)\(\);/g,
              replacement: 'parse\n    };\n  }\)\(SFAFx\);'
            }
          ]
        },
        files: [
          {src: './sfafx.js', dest: './sfafx.js'}
        ]
      }
    },

    peg: {
      sfafx_parser: {
        src: "grammar/sfafx_grammar.peg",
        dest: "grammar/sfafx_parser.js",
        options: {exportVar: "sfafx_parser"}
      }
    },

    concat: {
      options: {
        separator: "\n", //add a new line after each file
        banner: "//SFAFxJS https://github.com/Sciumo/sfafxjs\n\n", //added before everything
        footer: "" //added after everything
      },
      dist: {
        src: [
          'src/intro.js',
          'src/sfafx_base.js',
          //classes and files
          'grammar/sfafx_parser.js',
          'src/sfafx_dict.js',
          'src/sfafx_tosfaf.js',
          'src/outro.js'
        ],
        // final project file
        dest: 'sfafx.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      sfafxmin: {
        files: {
          'sfafx.min.js': ['sfafx.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('grammar', ['peg:sfafx_parser']);
  grunt.registerTask('dist', ['grammar', 'concat:dist', 'replace', 'uglify:sfafxmin']);
};
