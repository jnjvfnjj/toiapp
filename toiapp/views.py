from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Register, Super_user



def register_user(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        password = request.POST.get("password")

        Register.objects.create(
            username=username,
            email=email,
            phone=phone,
            password=password
        )

        return render(request, "register.html", {"success": True})

    return render(request, "register.html", {})



# ==============================
# Регистрация супер-пользователя (администратора)
# ==============================
def register_super_user(request):
    if request.method == "POST":
        name = request.POST.get("name")
        lastname = request.POST.get("lastname")
        email = request.POST.get("email")
        user_phone = request.POST.get("user_phone")
        build_phone = request.POST.get("build_phone")
        address = request.POST.get("address")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        if password != confirm_password:
            return HttpResponse("Пароли не совпадают!")

        Super_user.objects.create(
            name=name,
            lastname=lastname,
            email=email,
            user_phone=user_phone,
            build_phone=build_phone,
            address=address,
            password=password,
            confirm_password=confirm_password
        )

        return HttpResponse("Суперпользователь успешно создан!")

    return render(request, "register_super.html")  # страница формы
