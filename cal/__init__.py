from flask import Flask, render_template
from schema import db, Event, User

app = Flask(__name__)
app.config.from_object('config.flask_config')

db.init_app(app)


@app.before_request
def before_request():
    """ Do something before every request """
    return


@app.after_request
def after_request(resp):
    """ Do something after every request """
    return resp


@app.errorhandler(404)
def page_not_found(e):
    return "Page not found"


@app.route('/')
def home():
    events = Event.query.order_by(Event.start).all()

    monday_events = [event for event in events if event.start.weekday() == 1]
    tuesday_events = [event for event in events if event.start.weekday() == 2]
    wednesday_events = [event for event in events if event.start.weekday() == 3]
    thursday_events = [event for event in events if event.start.weekday() == 4]
    friday_events = [event for event in events if event.start.weekday() == 5]
    saturday_events = [event for event in events if event.start.weekday() == 6]
    sunday_events = [event for event in events if event.start.weekday() == 0]

    return render_template('index.html', events=events, monday_events=monday_events, tuesday_events=tuesday_events
    	wednesday_events=wednesday_events, thursday_events=thursday_events, friday_events=friday_events
    	saturday_events=saturday_events, sunday_events=sunday_events)

