import { React, Fluxo, _ } from "libs";
import ItemCheckbox from "components/options/item_checkbox";

export default React.createClass({
  toggle: function (projectID) {
    Fluxo.callAction("ConfigsIgnoredProjects", "toggle", projectID);
  },

  renderProjectOption: function(project) {
    return <ItemCheckbox onChange={this.toggle.bind(this, project.id)}
                         key={project.id}
                         checked={project.ignored}
                         label={project.name} />;
  },

  renderAccountProjects: function(accountName, projects) {
    return (
      <div key={accountName}>
        <h2>{accountName}</h2>
        {projects.map(this.renderProjectOption)}
      </div>
    );
  },

  render: function () {
    var groupped = _.groupBy(this.props.projects, function(project) {
      return project.account_name;
    });

    var accountProjects = _.inject(groupped, function(memo, projects, accountName) {
      memo.push(this.renderAccountProjects(accountName, projects));
      return memo;
    }, [], this);

    return (
      <div className="tab-content">
        <div className="message">
          <i className="icon-exclamation"></i> Only will affects new events
        </div>
        {accountProjects}
      </div>
    );
  }
});
