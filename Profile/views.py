import locale
from datetime import datetime

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.db.models import Q

from .models import Profile, Action, Position, Subject
from .forms import UserForm, UserFormEdit, SignInForm, ActionForm, SubjectForm, ProfileForm, PositionForm
from TaskManager.models import Schedule


# Create your views here.


locale.setlocale(locale.LC_TIME, 'ukrainian')

def sign_up(request: HttpRequest):
    if request.method == "POST":
        sign_up_form = UserForm(request.POST)
        profile_form = ProfileForm(data=request.POST, files=request.FILES)
        if sign_up_form.is_valid():
            user = sign_up_form.save()
            if profile_form.is_valid():
                profile = profile_form.save(commit=False)
                profile.user = user
                profile.save()
            else:
                profile = Profile(user=user)
                profile.save()

            messages.success(request, "Вітаємо з реєстрацією!")
            return redirect("sign_in")

        messages.error(request, sign_up_form.errors)
        return redirect("sign_up")
    return render(request, "sign_up.html", dict(sign_up_form=UserForm(), profile_form=ProfileForm()))



def sign_in(request: HttpRequest):
    if request.method == "POST":
        form = SignInForm(request.POST)
        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data.get("username"),
                password=form.cleaned_data.get("password")
            )
            if user:
                login(request, user)
                messages.success(request, "Вітаємо з поверненням!")
                return redirect("index")
            else:
                messages.error(request, "Користувача з такими параметрами не знайдено")
                return redirect("sign_in")
            
        messages.error(request, form.errors)
        return redirect("sign_in")
    
    return render(request, "sign_in.html", dict(form=SignInForm()))


@login_required
def update_profile(request: HttpRequest):
    if request.method == "POST":
        user_form = UserFormEdit(data=request.POST, instance=request.user)
        profile_form = ProfileForm(data=request.POST, files=request.FILES, instance=request.user.profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            if user_form.changed_data:
                user_form.save()
            if profile_form.changed_data:
                profile_form.save()
            messages.success(request, "Дані успішно оновлено")
            return redirect("profile")
        else:
            # Form validation errors will be displayed in template
            return render(
                request,
                "profile.html",
                dict(user_form=user_form, profile_form=profile_form)
            )
    
    return render(
        request,
        "profile.html",
        dict(user_form=UserFormEdit(instance=request.user), profile_form=ProfileForm(instance=request.user.profile))
    )


@login_required
def update_avatar(request: HttpRequest):
    if request.method != "POST":
        return redirect("profile")
    avatar_file = request.FILES.get("avatar")
    if not avatar_file or not avatar_file.content_type.startswith("image/"):
        messages.error(request, "Виберіть зображення.")
        return redirect("profile")
    profile = request.user.profile
    profile.avatar = avatar_file
    profile.save()
    messages.success(request, "Аватар оновлено.")
    return redirect("profile")


@login_required
def index(request: HttpRequest):
    # positions = Position.objects.filter(Q(name="Учень") | Q(name="Викладач")).all()
    if (User.
        objects.
        prefetch_related("Profile").
        prefetch_related("Position").
        filter(username=request.user.username, profile__positions__name__in=["Учень", "Вчитель"])
        .exists()):
        if request.user.profile.class_room:
            class_number = int(request.user.profile.class_room.name.split("-")[0])
            # Use explicit Ukrainian weekday names to match DB values reliably
            weekdays_uk = [
                "Понеділок",
                "Вівторок",
                "Середа",
                "Четвер",
                "П'ятниця",
                "Субота",
                "Неділя",
            ]
            day = weekdays_uk[datetime.now().weekday()]
            task = Schedule.objects.filter(day__iexact=day, study=class_number).order_by('number')
            return render(request, "index.html", dict(task=task, day_name=day))
    return render(request, "index.html")



@login_required
def logout_view(request: HttpRequest):
    logout(request)
    messages.success(request, "Ви успішно вийшли з системи. До зустрічі!")
    return redirect("sign_in")