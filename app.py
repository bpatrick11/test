from flask import Flask, jsonify, render_template
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

counter = 0
tickrate = 1000 #milliseconds


@app.route('/number')
def number():
    global counter
    counter += 1
    return jsonify(value=counter)


@app.route('/tickrate')
def number():
    global tickrate
    return jsonify(value=tickrate)

if __name__ == '__main__':
    app.run(debug=True)
