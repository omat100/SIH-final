from flask import Flask, jsonify, request

app = Flask(__name__)

# Simple GET endpoint
@app.route('/api', methods=['GET'])
def hello():
    return jsonify({'message': 'hello world'})

# POST endpoint to receive data
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    return jsonify({'received': data}), 201

if __name__ == '__main__':
    app.run(debug=True, port=6050)   