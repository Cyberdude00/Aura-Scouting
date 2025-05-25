# app.py
import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename # Recommended for handling filenames

app = Flask(__name__)

# --- Flask-Mail Configuration ---
# IMPORTANT: Replace these with your actual SMTP server details.
# It's highly recommended to use environment variables for sensitive info in production.
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com') # e.g., 'smtp.gmail.com' for Gmail
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))            # 465 for SSL, 587 for TLS
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', True)          # True for TLS, False for SSL
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', False)         # True for SSL, False for TLS
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your_email@example.com') # Your email address
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your_email_password')   # Your email password or app-specific password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'your_email@example.com') # Default sender if not specified

# Flask secret key for flashing messages (important for production)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key_that_should_be_changed')

# Optional: Set a maximum content length for uploads (e.g., 16 MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 Megabytes

mail = Mail(app)

# --- Routes ---
@app.route('/')
def index():
    """Renders the email sending form."""
    return render_template('index.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    """Handles the email sending logic."""
    if request.method == 'POST':
        # Gets data from the form
        user_email = request.form.get('user_email', 'anonymous@example.com') # Get user's email
        subject = request.form['subject']
        message_body = request.form['message']

        # Define your designated recipient email directly
        designated_recipient = 'your_suggestions_inbox@example.com' # <--- Set your actual email here

        # Create the email message
        msg = Message(
            subject=f"Suggestion: {subject}", # Optional: prefix subject with "Suggestion"
            recipients=[designated_recipient], # Send to your designated email
            body=f"From: {user_email}\n\n{message_body}", # Include user's email in body
            sender=app.config['MAIL_DEFAULT_SENDER'], # Uses the default sender configured
            reply_to=[user_email] # Set the reply-to header to the user's email
        )

         # Handle file attachment
        if 'attachment' in request.files:
            file = request.files['attachment']
            if file.filename != '': # Check if a file was actually selected
                try:
                    # Secure the filename to prevent directory traversal attacks
                    filename = secure_filename(file.filename)

                    # Read the file data in binary mode
                    file_data = file.read()

                    # Get the MIME type of the file
                    mimetype = file.content_type

                    # Attach the file to the email
                    msg.attach(filename, mimetype, file_data)
                    flash(f'File "{filename}" attached successfully.', 'info')
                except Exception as e:
                    flash(f'Error attaching file: {e}', 'warning')
                    # Optionally, you might want to stop here or proceed without the attachment
                    # For this example, we'll proceed and just flash a warning.
            else:
                flash('No file was selected for attachment.', 'info')

        try:
            mail.send(msg)
            flash('Email sent successfully!', 'success')
        except Exception as e:
            flash(f'Failed to send email: {e}', 'danger')

        return redirect(url_for('index')) # Redirect back to the form

if __name__ == '__main__':
    # For production, use a more robust WSGI server like Gunicorn or uWSGI
    app.run(debug=True) # debug=True is for development only. Set to False in production.