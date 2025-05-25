import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename # Still good for checking filename security
from dotenv import load_dotenv
import mimetypes # To guess content type for attachments

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- Flask-Mail Configuration ---
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'False').lower() == 'true'
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'False').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')

# Flask secret key for flashing messages (important for production)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key_that_should_be_changed')

# Add checks for missing essential variables
if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD'] or not app.config['MAIL_DEFAULT_SENDER']:
    raise ValueError("MAIL_USERNAME, MAIL_PASSWORD, and MAIL_DEFAULT_SENDER must be set in environment variables.")
if not app.config['SECRET_KEY'] or app.config['SECRET_KEY'] == 'a_very_secret_key_that_should_be_changed':
    print("WARNING: SECRET_KEY not set or using default. Generate a strong, random key for production!")

# Optional: Set a maximum content length for uploads (e.g., 16 MB)
# This limits the size of files that can be sent in the request body.
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 Megabytes

# Initialize Flask-Mail
mail = Mail(app)

# Allowed extensions for attachments (if you want to restrict what can be sent)
ALLOWED_ATTACHMENT_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'} # Added PDF as a common attachment

def allowed_file_extension(filename):
    """Checks if the file extension is allowed for attachment."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_ATTACHMENT_EXTENSIONS

# --- Routes ---
@app.route('/')
def index():
    """Renders the email sending form."""
    return render_template('index.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    """Handles the email sending logic."""
    # Get form data
    actor_name = request.form.get('actor_name')
    user_email = request.form.get('user_email')
    height = request.form.get('height')
    cellphone = request.form.get('cellphone')
    # Get the file object from the request
    file_obj = request.files.get('attachment')

    # Basic validation for required text fields
    if not all([actor_name, user_email, height, cellphone]):
        flash('All text fields (Model, Email, Height, Cellphone) are required.', 'danger')
        return redirect(url_for('index', _anchor='model-submission'))

    # Construct the email body
    message_body = (
        f"From: {user_email}\n"
        f"Model: {actor_name}\n"
        f"Height: {height}\n"
        f"Cellphone: {cellphone}\n"
    )

    # Define your designated recipient email (the actual inbox you want the email to go to)
    #designated_recipient = 'your_suggestions_inbox@example.com' # <<< IMPORTANT: SET YOUR ACTUAL RECIPIENT EMAIL HERE!
    designated_recipient = 'gerardo.quisol@gmail.com'

    # Create the email message
    msg = Message(
        subject=f"AuraScouting Model Suggestion: {actor_name}",
        recipients=[designated_recipient], # Send to your designated inbox
        body=message_body,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )

    # Handle file attachment directly from memory
    if file_obj and file_obj.filename != '': # Check if a file was provided and has a filename
        if allowed_file_extension(file_obj.filename):
            try:
                # Secure the filename for display in the email attachment
                filename = secure_filename(file_obj.filename)

                # Read the file data into memory
                # file_obj.read() reads the entire file content from the stream
                file_data = file_obj.read()
                print(f"File '{filename}' read into memory (size: {len(file_data)} bytes).") # Debug print

                # Get the MIME type from the file_obj (most reliable)
                mimetype = file_obj.content_type
                if not mimetype: # Fallback if content_type is not provided by browser
                    mimetype = mimetypes.guess_type(filename)[0] or 'application/octet-stream'

                # Attach the file to the email
                msg.attach(filename, mimetype, file_data)
                flash(f'File "{filename}" attached successfully.', 'info')

            except Exception as e:
                flash(f'Error attaching file: {e}', 'warning')
                app.logger.error(f"File attachment error: {e}")
        else:
            flash(f'File type not allowed for attachment: "{file_obj.filename.rsplit(".", 1)[1]}".', 'warning')
    else:
        flash('No file selected for attachment.', 'info')

    try:
        mail.send(msg)
        flash('Email sent successfully!', 'success')
        print("Email sent successfully!") # Debug print
    except Exception as e:
        flash(f'Failed to send email: {e}', 'danger')
        app.logger.error(f"Email send error: {e}")
        print(f"!!! ERROR: Failed to send email: {e} !!!")

    return redirect(url_for('index', _anchor='model-submission'))

if __name__ == '__main__':
    app.run(debug=True)