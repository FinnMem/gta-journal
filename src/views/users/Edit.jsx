import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import { mdiAccountMultiplePlus, mdiAccountPlus, mdiContentSave } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Checkbox } from 'primereact/checkbox';

function makePassword(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default function EditUser() {
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    isLoaded: false,
    info: {
      nickname: "",
      password: "",
      rank: "",
      bank: "",
      isAdmin: false,
      updateAvatar: false,
    },
  });
  const toast = React.useRef();

  const loadData = async () => {
    const session = JSON.parse(localStorage.getItem("session_data"));

    const response = await window.electronAPI.getRequest(
      `https://gta-journal.ru/user?id=${window.location.href
        .match(/id=[0-9]+/g)[0]
        .substring(3)}`,
      {
        headers: {
          "Accept-Language": "ru-RU,ru;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
          Cookie: `id=${session.id}; usid=${session.usid}`,
        },
      }
    );

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(response.data, "text/html");

    if (!parsedDocument.getElementById("bank")) navigate("/");

    user.info.nickname = parsedDocument.getElementById("login").value;
    user.info.bank = parsedDocument.getElementById("bank").value;
    user.info.rank = parsedDocument
      .getElementById("role")
      .querySelector("option[selected]").value;
    user.info.isAdmin = parsedDocument.getElementById("admin").checked;

    setUser({ isLoaded: true, info: user.info });
  };

  const editUser = () => {}

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="mx-auto w-6 shadow-4 flex flex-column align-items-center surface-card p-4 border-round-xl">
      <h2 className="mt-0">Изменить пользователя</h2>
      <Toast ref={toast} />

      <div className="flex flex-column gap-2 w-12 mt-3">
        <label htmlFor="nickname-filed" className="font-bold">
          Никнейм
        </label>
        <InputText
          value={user.info.nickname}
          onChange={(e) =>
            setUser({
              ...user,
              info: { ...user.info, nickname: e.target.value },
            })
          }
          id="nickname-field"
          placeholder="[ТЕГ] Ivan_Ivanov"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="password-filed" className="font-bold">
          Пароль
        </label>
        <InputText
          value={user.info.password}
          onChange={(e) =>
            setUser({
              ...user,
              info: { ...user.info, password: e.target.value },
            })
          }
          id="password-field"
          placeholder="Оставьте поле пустым чтобы не менять"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="bank-filed" className="font-bold">
          Счёт в банке
        </label>
        <InputText
          value={user.info.bank}
          onChange={(e) => setUser({ ...user, info: { ...user.info, bank: e.target.value } })}
          id="bank-field"
          placeholder="123456"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="rank-filed" className="font-bold">
          Ранг
        </label>
        <InputText
          value={user.info.rank}
          onChange={(e) => setUser({ ...user, info: { ...user.info, nickname: e.target.value } })}
          id="rank-field"
          placeholder="1"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex align-items-center w-12 mt-2">
        <Checkbox id="is-admin" checked={user.info.isAdmin} onChange={(e) => setUser({ ...user, info: { ...user.info, isAdmin: e.checked } })} />
        <label htmlFor="is-admin" className="font-bold ml-2">Администратор</label>
      </div>
      <div className="flex align-items-center w-12 mt-2">
        <Checkbox id="vk" checked={user.info.updateAvatar} onChange={(e) => setUser({ ...user, info: { ...user.info, updateAvatar: e.checked } })} />
        <label htmlFor="vk" className="font-bold ml-2">Обновить аватар</label>
      </div>
      <div className="flex flex-column w-12 gap-2 mt-4">
        <Button
          icon={<Icon size={1} path={mdiContentSave} />}
          label="Сохранить изменения"
          disabled={
            !user.info.nickname.match(/\[.+\] [A-Z][a-z]+_[A-Z][A-Za-z]+/g) ||
            isNaN(Number(user.info.rank)) ||
            Number(user.info.rank) > 10 ||
            Number(user.info.rank) < 0 ||
            !user.info.bank.length
          }
          onClick={() => editUser()}
        />
      </div>
    </div>
  );
}