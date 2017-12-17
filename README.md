# SWM
a django web about school washing machine.

## 2017-12-17

+ add `appointment.html`
+ add `money.html`
+ add `repairment.html`

## 2017-12-16

+ add appointment 
+ add money
+ add repairment

## 2017-12-14

+ `washmachine/findOne/{id}`
+ `washmachine/modify/`

## 2017-12-13

+ `washmachine/findAllOfCondition/`
+ `washmachine/remove/{id}/`
+ `washmachine/add/`

## 2017-12-12

+ add washmachine templates

## 2017-12-11

+ add views of washmachine

## 2017-12-10

+ add an app for repair

## 2017-12-09

+ delete user-avatar
+ use javascript less

## 2017-12-07

+ layer v=2.2.4
+ base.html
+ login.html--background

# 2017-12-06

+ register
+ edit the base information
+ edit the student information

## 2017-12-05

+ login and logout
+ change password
+ reset password

## 2017-12-04

+ add the authentication module

## 2017-11-09 

+ look for the static files outside my apps successfully.
+ deploy front-end app successfully. 

## 2017-11-08

+ reference the layui lib to speed up the development of the font-end.

location is **./static/lib/layui**

## 2017-10-30

+ add the following lines to modify the names of datebase's tables.

 ```python
 class models_name:
    ...

    class Meta:
        db_table = 'table_name'
 ```

## 2017-10-29

+ create apps.sign.models
+ completing the apps.sign.models

if you want to create mysql datebase automatically,please modify `./config/my.cnf` and execute lines following.

```commandline
python manage.py makemigrations

python manage.py migrate
```

## 2017-10-28

+ completing the connection between the project and the mysql database.