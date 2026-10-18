import {Check} from "@gravity-ui/icons";
import {Button, Description, FieldError, Form, Input, Label, TextField} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./login.zod";
import { useForm } from "react-hook-form";
import type { LoginUserDataType } from "./login.interface";
import toast from "react-hot-toast";
import { userLogin } from "./login.services";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useContext } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const router = useNavigate();
  const { setUserData } = useContext(UserAuthContext);

  function sendUserData(data: LoginUserDataType) {
    toast.promise(userLogin(data), {
      loading: "Please While Registering",
      success: function (data) {
        localStorage.setItem("token", data.data.token);
        setUserData(data.data.user);
        reset();
        router("/");
        return <h1 className="text-emerald-500 capitalize">{data.message}</h1>;
      },
      error: (data) => <h1 className="text-red-500 capitalize">{data.message}</h1>,
    });
  }

  return (
    <Form
      className="flex w-full max-w-lg flex-col gap-4 rounded-3xl border border-zinc-900/15 bg-white/75 p-5 text-zinc-900 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-zinc-900/55 dark:text-white sm:p-8"
      onSubmit={handleSubmit(sendUserData)}
    >
      <TextField isRequired name="email" type="email">
        <Label>Email</Label>
        <Input placeholder="john@example.com" {...register("email")} />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        minLength={8}
        name="password"
        type="password"
        isInvalid={!!errors.password}
      >
        <Label>Password</Label>
        <Input placeholder="Enter your password" {...register("password")} />
        <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
        <FieldError />
      </TextField>
      <div className="flex gap-2">
        <Button type="submit" isDisabled={isSubmitting}>
          <Check />
          Login
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </Form>
  );
}
