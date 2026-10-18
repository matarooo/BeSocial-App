import {Check} from "@gravity-ui/icons";
import {Button, Description, FieldError, Form, Input, Label, TextField, ListBox, Select} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { registerSchema } from "./register.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { userRegister } from "./register.services";
import type { UserDataType } from "./register.interface";
import { useNavigate } from "react-router";

export default function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors , isSubmitting},
    control,
    
  } = useForm<UserDataType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "male",
      dateOfBirth: "",
    },
    mode: "all",
    resolver: zodResolver(registerSchema)
    
  });
    const router =  useNavigate()
    
    async function sendUserData(data: UserDataType): Promise<void> {
      const toastId = toast.loading("Please wait your account is being registered");
      try {
        const message = await userRegister(data);
        toast.success(message, { id: toastId });
        router("/posts");
      } catch (error) {
        const message = error instanceof Error && error.message
          ? error.message
          : "Registration failed";
        toast.error(message, { id: toastId });
      }
  }
  return (
    <Form 
    onSubmit={handleSubmit(sendUserData)}
    className="flex w-full max-w-lg flex-col gap-4 rounded-3xl border border-zinc-900/15 bg-white/75 p-5 text-zinc-900 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-zinc-900/55 dark:text-white sm:p-8">
          {/* FullName */}
          <TextField
            isRequired
            name="name"
            type="text"
            isInvalid={!!errors.name}
          >
            <Label>Full Name</Label>
            <Input placeholder="John Doe" 
            {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </TextField>
          {/* FullName */}
          {/* UserName */}
          <TextField
            isRequired
            name="username"
            type="text"
            isInvalid={!!errors.username}
          >
            <Label>Username</Label>
            <Input placeholder="JohnDoe123" {...register("username")} />
            {errors.username && <FieldError>{errors.username.message}</FieldError>}
          </TextField>
          {/* UserName */}
          {/* Email */}
                    <TextField
            isRequired
            name="email"
            type="email"
            isInvalid={!!errors.email}
          >
            <Label>Email</Label>
            <Input placeholder="johndoe@example.com" {...register("email")}/>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </TextField>
          {/* Email */}
          {/* Password */}
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            isInvalid={!!errors.password}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" {...register("password")}/>
            <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </TextField>
          {/* Password */}
          {/* rePassword */}
          <TextField
            isRequired
            minLength={8}
            name="rePassword"
            type="password"
            isInvalid={!!errors.rePassword}
          >
            <Label>Confirm password</Label>
            <Input placeholder="Enter your password" {...register("rePassword")}/>
            <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
            {errors.rePassword && <FieldError>{errors.rePassword.message}</FieldError>}
          </TextField>
          {/* rePassword */}
          {/* Gender */}
          <Controller name="gender" control={control} render={function({field}) {
          return  <Select
            className=""
            placeholder="Select one"
            selectedKey={field.value}
            onSelectionChange={function(key) {
              if (key !== null) field.onChange(key);
            }}
            onBlur={field.onBlur}
            isInvalid={!!errors.gender}
          >
            <Label>Gender</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="male" textValue="male">
                  Male
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="female" textValue="female">
                  Female
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
                  {errors.gender && <span className="text-red-500 text-xs">{errors.gender?.message}</span>}

          </Select>
        }}/>

          {/* Gender */}
          {/* DOB */}
          <TextField
            isRequired
            className="w-full"
            name="dateOfBirth"
            type="date"
            isInvalid={!!errors.dateOfBirth}
          >
            <Label>Birth date</Label>
            <Description>Enter your date of birth</Description>
            <Input {...register("dateOfBirth")} />
            {errors.dateOfBirth && <FieldError>{errors.dateOfBirth.message}</FieldError>}
          </TextField>
          {/* DOB */}
          <div className="flex gap-2">
            <Button type="submit" isDisabled={isSubmitting}>
              <Check />
              Register
            </Button>
            <Button type="reset" variant="secondary">
              Reset
            </Button>
          </div>
        </Form>
  )
}
