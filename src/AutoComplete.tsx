import { useEffect, useRef, useState } from "react";
import DummyData from "../src/data.json";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const AutoComplete = () => {
  //states

  const [inputValue, setInputValue] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showList, setShowList] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  //chip state
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  //list state
  const [filteredListData, setFilteredListData] = useState<User[]>(
    DummyData.data
  );

  const inputRef = useRef<null | HTMLInputElement>(null);
  const autocompleteRef = useRef<null | HTMLDivElement>(null);

  function removeUserFromFilteredList(id: string) {
    const data = filteredListData.filter((item) => item.id !== id);
    setFilteredListData(data);
  }

  function removeUserFromSelectedUserList(id: string) {
    const data = selectedUsers.filter((item) => item.id !== id);
    setSelectedUsers(data);
  }

  function addUserToFilteredListData(id: string) {
    const user = selectedUsers.find((item) => item.id === id);
    if (user) setFilteredListData([user, ...filteredListData]);
  }

  function handleListItemClick(id: string) {
    const user = filteredListData.find((item) => item.id === id);
    if (user) setSelectedUsers([...selectedUsers, user]);
    removeUserFromFilteredList(id);
    if (inputRef && inputRef.current) inputRef.current.focus();
    setIsFirstTime(false);
  }

  function handleInputValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShowList(true);
    setInputValue(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Backspace") {
      if (isFirstTime) {
        setIsFirstTime(false);
        if (selectedUsers.length > 0) {
          const data = selectedUsers.slice(0, selectedUsers.length - 1);
          setSelectedUsers(data);
          addUserToFilteredListData(selectedUsers[selectedUsers.length - 1].id);
        }
      } else {
        setIsFirstTime(true);
      }
    }
  }

  function handleOutsideClick(e: MouseEvent) {
    if (autocompleteRef && autocompleteRef.current)
      if (!autocompleteRef.current?.contains(e.target as Node)) {
        setShowList(false);
      }
  }

  function handleEnterKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleListItemClick(activeItem);
    }
  }

  useEffect(() => {
    const data = DummyData.data.filter((el) =>
      el.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredListData(data);
  }, [inputValue]);

  //handles outside click
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  //handles enter key press
  useEffect(() => {
    document.addEventListener("keydown", handleEnterKeyPress);
    return () => document.removeEventListener("keydown", handleEnterKeyPress);
  }, [activeItem]);

  // useEffect(() => {
  //   document.addEventListener("keydown", (e) => console.log({ e }));
  //   return () => document.removeEventListener("keydown", () => handleArrowDown);
  // }, []);

  return (
    <div className=" w-full flex justify-center p-12">
      {/* autocomplete div */}
      <div
        className="outline-1 outline-gray-400 rounded-md flex items-center px-4 py-2 gap-2 w-2/3 flex-wrap"
        onKeyDown={(e) => handleKeyDown(e)}
        ref={autocompleteRef}
        onClick={() => inputRef.current?.focus()}
      >
        {/* selected users list */}
        {selectedUsers?.map((user, idx) => (
          <span
            className={`outline-1 text-gray-600 rounded-full outline-gray-300 px-4 py-1 whitespace-nowrap ${
              isFirstTime && idx === selectedUsers.length - 1
                ? " outline-red-400"
                : ""
            }`}
            key={idx}
          >
            {user.name}
            <span
              className="px-2 font-bold cursor-pointer"
              onClick={() => {
                removeUserFromSelectedUserList(user.id);
                addUserToFilteredListData(user.id);
              }}
            >
              X
            </span>
          </span>
        ))}
        <div className="relative">
          {/* input element */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Add new user ..."
            onChange={(e) => handleInputValueChange(e)}
            className="p-3 border-none rounded-md z-10 focus-visible:outline-none"
            onFocus={() => setShowList(true)}
          />
          {filteredListData.length > 0 && (
            <div
              className={`h-56 absolute top-17 overflow-auto shadow-md ${
                showList ? "block" : "hidden"
              }`}
            >
              {/* menu items */}
              <div className="m-2 ">
                {filteredListData.map((data, idx) => (
                  <div
                    key={idx}
                    className="hover:bg-gray-400 hover:text-white h-10 flex items-center px-2 cursor-pointer"
                    onClick={() => {
                      handleListItemClick(data.id);
                    }}
                    onMouseOver={() => setActiveItem(data.id)}
                    // onKeyDown={(e) => console.log("inside", { e })}
                  >
                    {data.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoComplete;
