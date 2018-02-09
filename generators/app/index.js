

'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay(
      chalk.blue('AWS SAM') + ' ' + chalk.red('Typescript\n') + 'Project Generator'
    ));

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project Name:',
        default: this.appname
      },
      {
        type: 'input',
        name: 'initialVersion',
        message: 'Initial Version:',
        default: "0.1.0"
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project Description:',
        default: ''
      },
      {
        type: 'list',
        name: 'license',
        message: 'Project License:',
        choices: [
          "MIT",
          "BSD",
          "GPL",
          "ISC"
        ]
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: ''
      },
      {
        type: 'confirm',
        name: 'installAWSSdk',
        message: 'Install aws-sdk library?',
        default: false
      },
    ];

    this.prompt(prompts).then(props => {
      this.props = props;
      done();
    });
  }

  writing() {
    this.log("Copying Files...");

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json') , {
        name: this.props.projectName,
        initialVersion: this.props.initialVersion,
        description: this.props.description,
        author: this.props.author,
        license: this.props.license,
        installAWSSdk: this.props.installAWSSdk
      }
    );

    this.fs.copy(
      this.templatePath('_tsconfig.json'),
      this.destinationPath('tsconfig.json')
    );

    this.fs.copy(
      this.templatePath('_webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );

    this.fs.copyTpl(
      this.templatePath('_template.yml'),
      this.destinationPath('template.yml'), {
        description: this.props.description
      }
    );

    this.fs.copy(
      this.templatePath('src/_helloworldsample.function.ts'),
      this.destinationPath('src/helloworldsample.function.ts')
    );

    this.fs.copy(
      this.templatePath('_cfn-deploy.sh'),
      this.destinationPath('cfn-deploy')
    );

  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    }).then(() => {
      "Project creation complete! Happy FaaSing!";
    });
  }
};
