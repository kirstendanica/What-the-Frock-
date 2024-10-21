from flask import Flask, jsonify
from pinterest import Pinterest

app = Flask(__name__)

# MY Pinterest API credentials
pinterest = Pinterest(email='YOUR_EMAIL', password='YOUR_PASSWORD', username='YOUR_USERNAME', cred_root='pinterest_credentials')

# Pinterest Login
pinterest.login()

# Route to fetch outfit from a board
@app.route('/get-outfit')
def get_outfit():
    # Replace 'board_id' with the Pinterest board you want to pull from
    pins = pinterest.board_feed(board_id='YOUR_BOARD_ID')
    # Pick a random pin (or add logic to choose based on the weather later)
    pin = pins[0]  # For now, just grabbing the first one
    
    return jsonify({
        'description': pin['description'],
        'image_url': pin['images']['orig']['url']
    })

if __name__ == '__main__':
    app.run(debug=True)
