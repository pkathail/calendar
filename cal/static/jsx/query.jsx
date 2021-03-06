function toDateString(date) {
    return (date.getFullYear().toString() + "/" +
            (date.getMonth() + 1).toString() + "/" + // +1 b/c js months start at 0
            date.getDate().toString());
}

var RSearch = React.createClass({
    onclick: function() {
        var url = "/events/" + toDateString(this.props.date);
        var search_string = document.getElementById("searchbar").value;
        // Empty search string check.
        var payload = search_string === "" ? {} : {search: search_string};

        $.getJSON(url, payload, function(data) {
            this.props.setGlobalState({eventList: data.data});
        }.bind(this));
    },

    onKeyPress: function(e) {
        // When user presses enter in the search bar, start a search.
        var RETURN = 13;
        if (e.charCode == RETURN) {
            this.onclick();
        }
    },

    render: function() {
        //div instead of form so that page doesn't reload
        return (
            <div className="search">
                <input id="searchbar" className="searchBar" type="text" onKeyPress={this.onKeyPress}/>
                <button onClick={this.onclick}> Search </button>
                <RDownload userList={ this.props.userList }/>
                <RNextWeek incrementDate={this.props.incrementDate}/>
            </div>
        );
    }
});

var RReset = React.createClass({
    onclick: function() {
        // Check all checkboxes.
        $("input[name='user'").prop('checked', true);
        this.props.setDate(new Date());
    },
    render: function() {
        return (
            <button className="reset" onClick={this.onclick}> Reset </button>
        );
    }
});

var RFilterCheckbox = React.createClass({
    render: function() {
        var user = this.props.user;
        return (
            <div className="filterForm">
                <input type="checkbox" name="user" id={user.id}
                        onChange={this.handleChange} defaultChecked="true"/>
                <label htmlFor={user.id}>{user.name}</label>
                <br />
            </div>
        );
    },

    handleChange: function(e) {
        // If user is checked, add events.
        if (e.target.checked) {
            this.props.addUser(e.target.id);
        }
        else {
            this.props.removeUser(e.target.id);
        }
    }
});

var RFilterForm = React.createClass({
    render: function() {
        var addFunction = this.props.addUser;
        var removeFunction = this.props.removeUser;
        var userNodes = this.props.userList.map(function(user) {
            return (
                <RFilterCheckbox key={user.id} user={user} 
                    removeUser={removeFunction} addUser={addFunction}/>
            );
        });

        return (
            <div className="filterForm">
                <form action=""> 
                    { userNodes }
                </form>
            </div>
        );
    }
});

var RDownload = React.createClass({
    onClick: function() {
        var uids = this.props.userList.map(function (user) {
            return user.id;
        });
        url = "/isc/?" + $.param({event_ids: uids});
        // kind of a hack, don't know how else to do it
        window.location.href = url;
    },
    render: function() {
        return (
            <button className="exportButton" onClick={ this.onClick }> Export </button>
        );
    }
});

var RQuery = React.createClass({
    render: function() {
        return (
            <div className="query">
                <RReset setGlobalState={this.props.setGlobalState} date={this.props.date} setDate={this.props.setDate}/>
                <RFilterForm userList={ this.props.userList } removeUser={this.props.removeUser} addUser={this.props.addUser}/>
            </div>
        );
    }
});
