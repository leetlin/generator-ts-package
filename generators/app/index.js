const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const Scaffold = require('scaffold-generator')
const mustache = require('mustache')
const commonPrompts = require('common-generator-prompts')()

mustache.escape = v => v

const DEFAULT_PROPS = {
  gitignore: '.gitignore',
  package_json: 'package.json'
}

const removeScope = s => s.replace(/^@[a-z0-9]+\//, '')

const getJsName = name => removeScope(name)
.replace(/^\d+/, '')
.replace(/-/g, '_')

const getPathName = name => removeScope(name)
.replace(/\//g, '-')

module.exports = class BFFGenerator extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the luminous ${chalk.red('CommonJS')} generator!`)
    )

    const prompts = commonPrompts

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
    })
  }

  async writing () {
    const {
      git: parsed,
      name,
    } = this.props

    const {
      user,
      repo
    } = parsed

    const data = {
      ...DEFAULT_PROPS,
      ...this.props,
      js_name: getJsName(name),
      path_name: getPathName(name),
      user,
      repo,
      git_clone_url: parsed.git_clone_url,
      git_issue_url: `${parsed.https_href}/issues`
    }

    await new Scaffold({
      data,
      render: mustache.render
    })
    .copy(this.templatePath(), this.destinationPath())
  }

  install () {
    this.installDependencies({
      bower: false
    })
  }
}
