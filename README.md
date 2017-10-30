# SWM
a django web about school washing machine.

## 2017-10-28

+ completing the connection between the project and the mysql database.

## 2017-10-29

+ create apps.sign.models
+ completing the apps.sign.models

if you want to create mysql datebase automatically,please modify `./config/my.cnf` and execute lines following.

```
>python manage.py makemigrations

> python manage.py migrate
```

## 2017-10-30

+ add the following lines to modify the names of datebase's tables

 ```
 class models_name:
    ...

    class Meta:
        db_table = 'table_name'
 ```
