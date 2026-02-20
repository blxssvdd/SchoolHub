from django.apps import AppConfig


class ProfileConfig(AppConfig):
    name = 'Profile'
    default_auto_field = 'django.db.models.BigAutoField'
    # No automatic signal import — Google-avatar signals removed
