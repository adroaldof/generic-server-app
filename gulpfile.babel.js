/* eslint-disable spaced-comment, max-len */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import babelCompiler from 'babel-core/register';
import * as isparta from 'isparta';
import args from 'yargs';
import del from 'del';
import fs from 'graceful-fs';
import runSequence from 'run-sequence';


const plugins = gulpLoadPlugins();
const releaser = require('conventional-github-releaser');

const paths = {
    configs: {
        changelog: './CHANGELOG.md',
        gitignore: './.gitignore',
        jscsrc: './.jscsrc',
        jshintrc: './.jshintrc',
        package: './package.json'
    },
    dirs: {
        base: './',
        coverage: './coverage',
        lib: './lib',
        docs: {
            base: './docs',
            doc: './docs/doc',
            api: './docs/api'
        },
        public: './public',
        src: './src',
        views: './views'
    },
    files: {
        js: [
            './src/**/*.js',
            '!./src/**/*.tests.js',
            '!./lib/**/*',
            '!./node_modules/**/*',
            '!./coverage/**/*',
            '!./gulpfile.babel.js'
        ],
        tests: './src/**/*.tests.js'
    },
    jslint: [
        './gulpfile.babel.js',
        './src/**/*.js',
        '!./lib/**/*.js'
    ]
};

const options = {
    codeCoverage: {
        reporters: ['lcov', 'text-summary'],
        thresholds: {
            global: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80
            },
            each: {
                statements: 50,
                branches: 50,
                functions: 50,
                lines: 50
            }
        }
    }
};


/************************************************************************
 * Clean files
 ************************************************************************/

gulp.task('clean', () => {
    const pathsToDelete = [
        paths.dirs.lib
    ];

    return del(pathsToDelete);
});


gulp.task('clean-full', () => {
    const pathsToDelete = [
        paths.dirs.docs.base,
        paths.dirs.coverage,
        paths.dirs.lib
    ];

    return del(pathsToDelete);
});


/************************************************************************
 * Copy non JS Files
 ************************************************************************/

gulp.task('copy', () => {
    gulp.src([paths.configs.gitignore, paths.configs.package])
        .pipe(plugins.newer(paths.dirs.lib))
        .pipe(gulp.dest(paths.dirs.lib));
});


/************************************************************************
 * Documentation
 ************************************************************************/

gulp.task('document', () => gulp
    .src(paths.dirs.src)
    .pipe(plugins.esdoc({ destination: paths.dirs.docs.doc }))
);


gulp.task('apidoc', (done) => {
    const options = { // eslint-disable-line no-shadow
        src: paths.dirs.src,
        dest: paths.dirs.docs.api,
        verbose: true,
        includeFilters: ['.*\\.js$']
    };

    plugins.apidoc(options, done);
});


/************************************************************************
 * Linters
 ************************************************************************/

gulp.task('eslint', () => {
    gulp.src(paths.jslint)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
});


/************************************************************************
 * Transpiler
 ************************************************************************/

gulp.task('transpile', () => gulp
    .src(paths.files.js, { base: paths.dirs.src })
    .pipe(plugins.newer(paths.dirs.lib))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
        includeContent: false,
        sourceRoot (file) {
            return path.relative(file.path, __dirname);
        }
    }))
    .pipe(gulp.dest(paths.dirs.lib))
);


/************************************************************************
 * Tests
 ************************************************************************/

/**
 * Set node environment variable to test
 },
 "devDependencies": {
 */
gulp.task('set-env', () => {
    plugins.env({
        vars: {
            NODE_ENV: 'test'
        }
    });
});


/**
 * Convert files to code coverage
 */
gulp.task('pre-test', () => gulp
    .src([...paths.files.js])
    .pipe(plugins.istanbul({
        instrumenter: isparta.Instrumenter,
        includeUntested: true
    }))
    .pipe(plugins.istanbul.hookRequire())
);


/**
 * Start mocha tests
 */
gulp.task('run-test', ['pre-test', 'set-env'], () => {
    let reporters;
    let exitCode = 0;

    if (plugins.util.env['code-coverage-reporter']) {
        reporters = [
            ...options.codeCoverage.reporters,
            plugins.util.env['code-coverage-reporter']
        ];
    } else {
        reporters = options.codeCoverage.reporters;
    }

    return gulp.src([paths.files.tests], { read: false })
        .pipe(plugins.plumber())
        .pipe(plugins.mocha({
            reporter: plugins.util.env['mocha-reporter'] || 'spec',
            colors: true,
            ui: 'bdd',
            timeout: 6000,
            compilers: { js: babelCompiler }
        }))
        .once('error', (err) => {
            plugins.util.log(err);
            exitCode = 1;
        })
        .pipe(plugins.istanbul.writeReports({
            dir: paths.dirs.coverage,
            reporters
        }))
        .pipe(plugins.istanbul.enforceThresholds({
            thresholds: options.codeCoverage.thresholds
        }))
        .once('end', () => {
            plugins.util.log('*** Tests Completed ***');
            process.exit(exitCode);
        });
});


/**
 * Execute tests
 * This will clean, transpile, copy and run tests
 */
gulp.task('test', ['clean'], () => {
    runSequence(
        ['copy', 'transpile'],
        'run-test'
    );
});


/************************************************************************
 * Start server and live reloading
 ************************************************************************/

gulp.task('nodemon', () => {
    plugins.nodemon({
        script: path.join(paths.dirs.lib, 'index.js'),
        ext: 'js',
        verbose: true,
        watch: [
            paths.dirs.docs.base,
            paths.dirs.coverage,
            paths.dirs.public,
            paths.dirs.src,
            paths.dirs.views
        ],
        ignore: [
            'node_module/',
            'lib/',
            'gulpfile.babel.js'
        ],
        tasks: ['transpile']
    });
});


/************************************************************************
 * Release
 ************************************************************************/

const releaseTypeName = args.argv.type;

function releaseTask (type) {
    gulp.src(paths.configs.package)
        .pipe(plugins.bump({ type }))
        .pipe(gulp.dest(paths.dirs.base));
}

function getPackageJsonVersion () {
    return JSON.parse(fs.readFileSync(paths.configs.package, 'utf8')).version;
}


gulp.task('pre-release', () => {
    releaseTask('prerelease');
});


gulp.task('patch-release', () => {
    releaseTask('patch');
});


gulp.task('minor-release', () => {
    releaseTask('minor');
});


gulp.task('major-release', () => {
    releaseTask('major');
});

gulp.task('changelog', () => gulp
    .src(paths.configs.changelog)
    .pipe(plugins.conventionalChangelog())
    .pipe(gulp.dest(paths.dirs.base))
);


gulp.task('github-release', (done) => {
    releaser({
        type: 'oauth',
        token: 'GITHUB_ACCESS_TOKEN'
    }, {
        preset: 'Releasing Version'
    }, done);
});


gulp.task('commit-changes', () => gulp
    .src('.')
    .pipe(plugins.git.add())
    .pipe(plugins.git.commit(
        String('New tag and bumped ')
            .concat(releaseTypeName)
            .concat(' version number v')
            .concat(getPackageJsonVersion()))
    )
);


gulp.task('push-changes', (cb) => {
    plugins.git.push('origin', 'master', cb);
});


gulp.task('create-new-tag', (cb) => {
    const tagData = {
        tag: String('v').concat(getPackageJsonVersion()),
        message: String('Created Tag for version: v').concat(getPackageJsonVersion())
    };

    return plugins.git.tag(tagData.tag, tagData.message, (error) => {
        if (error) {
            return cb(error);
        }

        plugins.util.log(String('tag version ').concat(tagData.tag));
        return plugins.git.push('origin', 'master', { args: '--tags' }, cb);
    });
});


gulp.task('release', () => {
    function releaseType (releaseTypeName) {
        switch (releaseTypeName) {
            case 'pre':
                return 'pre-release';
            case 'patch':
                return 'patch-release';
            case 'minor':
                return 'minor-release';
            case 'major':
                return 'major-release';
            default:
                plugins.util.log('You can choose release type among "pre|patch|minor|major"');
                plugins.util.log('Using now "patch"');
                return 'patch-release';
        }
    }

    function callback (err) {
        if (err) {
            plugin.util.log('--- Error ---');
            return plugins.util.log(err.message);
        }

        plugin.util.log('--- OK ---');
        return plugins.util.log('RELEASE FINISHED SUCCESSFULLY');
    }


    runSequence(
        releaseType(releaseTypeName),
        'changelog',
        'commit-changes',
        'push-changes',
        'create-new-tag',
        'github-release',
        callback
    );
});


/************************************************************************
 * Grouping Tasks
 *************************************************************************/

gulp.task('documentate', [
    'document',
    'apidoc'
]);


gulp.task('build', [
    'transpile',
    'documentate'
]);


gulp.task('lint', [
    'eslint'
]);


gulp.task('default', [
    'lint',
    'build'
]);

gulp.task('serve', ['clean'], () => {
    runSequence('copy', 'transpile', 'nodemon');
});

gulp.task('full-serve', () => {
    runSequence(
        'clean-full',
        'lint',
        'transpile',
        'test',
        'documentate',
        'nodemon'
    );
});

gulp.task('help', () => {
    plugins.util.log('================================================================================');
    plugins.util.log('Available commands');
    plugins.util.log('================================================================================');
    plugins.util.log('| npm run serve       | gulp serve       | Run local server with live reload');
    plugins.util.log('| npm run full-serve  | gulp full-serve  | Run test, documentation and server');
    plugins.util.log('| npm run test        | gulp test        | Run tests and generate `coverage`');
    plugins.util.log('| npm run lint        | gulp lint        | Lint JS files (JSHint and JSCS)');
    plugins.util.log('| npm run documentate | gulp documentate | Generate documentation at `docs`');
    plugins.util.log('| npm run clean       | gulp clean       | Clean `docs`, `coverage` and `lib`');
    plugins.util.log('| npm run pre         | gulp pre         | Git Tag pre release (E.g. 0.0.0-1)');
    plugins.util.log('| npm run patch       | gulp patch       | Git Tag patch release (E.g. 0.0.1)');
    plugins.util.log('| npm run minor       | gulp minor       | Git Tag minor release (E.g. 0.1.0)');
    plugins.util.log('| npm run major       | gulp major       | Git Tag major release (E.g. 0.1.0)');
    plugins.util.log('| npm run help        | gulp help        | Show this help options');
    plugins.util.log('================================================================================');
});
