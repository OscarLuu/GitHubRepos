var React = require("react");
var PropTypes = require("prop-types");
var api = require("../utils/api");

function TitleBar(props) {
  return (
    <div className="title">
      <h1 className="header">Top Repos for {props.lang}</h1>
    </div>
  );
}

function SelectLanguage(props) {
  var languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
  return (
    <ul className="languages">
      {languages.map(function(lang) {
        return (
          <li
            className="bar"
            style={
              lang === props.selectedLanguage ? { color: "#146eff" } : null
            }
            onClick={props.onSelect.bind(null, lang)}
            key={lang}
          >
            {lang}
          </li>
        );
      })}
    </ul>
  );
}

function RepoGrid(props) {
  return (
    <ul className="popular-list">
      {props.repos.map(function(repo, index) {
        return (
          <div className="separate">
            <li key={repo.name} className="popular-item">
              <div className="popular-rank">#{index + 1}</div>
              <ul className="space-list-items">
                <li>
                  <img
                    className="avatar"
                    src={repo.owner.avatar_url}
                    alt={"Avatar for " + repo.owner.login}
                  />
                </li>
                <li>
                  <a href={repo.html_url}>{repo.name}</a>
                </li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count} stars</li>
              </ul>
            </li>
          </div>
        );
      })}
    </ul>
  );
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

class Popular extends React.Component {
  constructor(props) {
    // When setting state, you need to use super(props)
    super();
    this.state = {
      // The selected language will be defaulted to All
      selectedLanguage: "All",
      repos: null
    };
    // This binding is necessary to make `this` work in the callback
    this.updateLanguage = this.updateLanguage.bind(this);
  }
  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(lang) {
    this.setState(function() {
      return {
        selectedLanguage: lang,
        repos: null
      };
    });
    // AJAX
    api.fetchPopularRepos(lang).then(
      function(repos) {
        this.setState(function() {
          return {
            repos: repos
          };
        });
        // bind the this keyword to make it the same as if it were outside of that function
      }.bind(this)
    );
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        <TitleBar lang={this.state.selectedLanguage} />
        {!this.state.repos ? (
          <p>Loading</p>
        ) : (
          <RepoGrid repos={this.state.repos} />
        )}
      </div>
    );
  }
}

module.exports = Popular;
