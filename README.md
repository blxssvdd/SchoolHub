# SchoolHub

SchoolHub is a comprehensive Django-based web application designed to streamline various administrative and organizational tasks within an educational institution. It provides a centralized platform for managing user profiles, booking resources, and organizing schedules, making school management more efficient and accessible.

## Key Features

- **User and Profile Management:**
  - Robust user authentication and profile system built on Django's authentication framework.
  - User profiles include avatars, bios, and contact information.
  - Role-based access control (RBAC) with customizable positions and permissions (e.g., student, teacher, admin).

- **Resource Booking System:**
  - Allows users to book school resources like classrooms, labs, or equipment.
  - Resources can be categorized by type and location.
  - Bookings can be managed with different statuses (e.g., confirmed, pending, canceled).
  - A logging system tracks all booking activities.

- **Schedule and Task Management:**
  - Create and manage class schedules.
  - Schedules can be linked to specific resources (classrooms), subjects, and classes.
  - Includes support for online classes with links to meeting URLs.

- **Modular Architecture:**
  - The project is divided into logical Django apps (`Profile`, `Booking`, `Resource`, `TaskManager`), promoting code organization and scalability.

## Technology Stack

- **Backend:** Django 6.0, Python
- **Database:** PostgreSQL (can be configured for other Django-supported databases)
- **Image Handling:** Pillow
- **Environment Variables:** python-dotenv

## Project Structure

The project is organized into the following Django apps:

- `SchoolHub/`: The main Django project folder.
- `Profile/`: Manages user profiles, roles, and permissions.
- `Resource/`: Handles the management of bookable resources.
- `Booking/`: Contains the logic for booking resources.
- `TaskManager/`: Manages schedules and tasks.

## How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SchoolHub
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the project root.
   - Add your database credentials and other settings to the `.env` file (e.g., `DATABASE_URL`, `SECRET_KEY`).

5. **Apply database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```
   The application will be available at `http://127.0.0.1:8000`.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
