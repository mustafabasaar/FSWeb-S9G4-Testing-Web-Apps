import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import Goruntule from "./Goruntule";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByTestId("baslik");
  expect(header).toHaveTextContent(/İletişim Formu/);
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "ASD");

  const message = await screen.findByText(
    /Hata: ad en az 5 karakter olmalıdır./i
  );
  expect(message).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), " ");

  const message = await screen.findByText(
    /Hata: ad en az 5 karakter olmalıdır./i
  );
  expect(message).toBeInTheDocument();

  const input = screen.getByPlaceholderText("Mansız");
  userEvent.type(input, " ");
  userEvent.clear(input);
  const messagelastname = await screen.findByText(/Hata: soyad gereklidir./i);
  expect(messagelastname).toBeInTheDocument();

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    " "
  );

  const messageemail = await screen.findByText(
    /Hata: email geçerli bir email adresi olmalıdır./i
  );
  expect(messageemail).toBeInTheDocument();
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const errorMessage = screen.queryByTestId("error-message");
  userEvent.type(screen.getByPlaceholderText("İlhan"), "İlhan");
  expect(errorMessage).toBeNull();

  const input = screen.getByPlaceholderText("Mansız");
  userEvent.type(input, "İlhan");
  expect(errorMessage).toBeNull();

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    " "
  );

  const messageemail = await screen.findByText(
    /Hata: email geçerli bir email adresi olmalıdır./i
  );
  expect(messageemail).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "yüzyılıngolcüsühotmail.com"
  );

  const messageemail = await screen.findByText(
    /Hata: email geçerli bir email adresi olmalıdır./i
  );
  expect(messageemail).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const input = screen.getByPlaceholderText("İlhan");
  const input1 = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  const button = screen.getByTestId("submitbutton");
  userEvent.type(input, "İlhan");

  userEvent.type(input1, "yüzyılıngolcüsü@hotmail.com");

  userEvent.click(button);

  const messagelastname = await screen.findByText(/Hata: soyad gereklidir./i);
  expect(messagelastname).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByTestId("ad");
  const soyad = screen.getByTestId("soyad");
  const email = screen.getByTestId("email");
  const button = screen.getByTestId("submitbutton");
  const errorMessage = screen.queryByTestId("error-message");
  userEvent.type(ad, "İlhan");
  userEvent.type(soyad, "Mansız");
  userEvent.type(email, "yüzyılıngolcüsü@hotmail.com");
  expect(errorMessage).toBeNull();
  userEvent.click(button);
  const firstnameDisplay = screen.getByTestId("firstnameDisplay");
  const lastnameDisplay = screen.getByTestId("lastnameDisplay");
  const emailDisplay = screen.getByTestId("emailDisplay");
  expect(firstnameDisplay).toHaveTextContent(/Ad: İlhan/);
  expect(lastnameDisplay).toHaveTextContent(/Soyad: Mansız/);
  expect(emailDisplay).toHaveTextContent(/Email: yüzyılıngolcüsü@hotmail.com/);

  userEvent.type(screen.getByPlaceholderText("İlhan"), "İlhan");
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByTestId("ad");
  const soyad = screen.getByTestId("soyad");
  const email = screen.getByTestId("email");
  const mesaj = screen.getByTestId("notlar");
  const button = screen.getByTestId("submitbutton");
  userEvent.type(ad, "İlhan");
  userEvent.type(soyad, "Mansız");
  userEvent.type(email, "yüzyılıngolcüsü@hotmail.com");
  userEvent.type(mesaj, "daha iyileri var");
  userEvent.click(button);

  const firstnameDisplay = screen.getByTestId("firstnameDisplay");
  const lastnameDisplay = screen.getByTestId("lastnameDisplay");
  const emailDisplay = screen.getByTestId("emailDisplay");
  const messageDisplay = screen.getByTestId("messageDisplay");
  expect(firstnameDisplay).toHaveTextContent(/Ad: İlhan/);
  expect(lastnameDisplay).toHaveTextContent(/Soyad: Mansız/);
  expect(emailDisplay).toHaveTextContent(/Email: yüzyılıngolcüsü@hotmail.com/);
  expect(messageDisplay).toHaveTextContent(/Mesaj: daha iyileri var/);
});
