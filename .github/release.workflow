workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Test" {
  uses = "actions/npm@master"
  args = "test"
  needs = ["Install"]
}

action "Build" {
  uses = "actions/npm@master"
  args = "build"
  needs = ["Install", "Test"]
}

# Filter for a new tag
action "Versioning" {
  needs = "Build"
  uses = "actions/npm@e7aaefe"
  args = "release"
  secrets = ["GITHUB_TOKEN"]
}

action "Publish" {
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
  needs = ["Build", "Versioning"]
}
