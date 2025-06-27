from flask import *

app = Flask(__name__)

@app.route('/api/predictSeverity')
def predictSeverity():
    return 0;

if (__name__ == '__main__'):
    app.run(debug=True)