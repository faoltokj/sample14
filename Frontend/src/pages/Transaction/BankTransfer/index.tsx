import Breadcrumb from "@/libs/components/BreadCrumb";
import Authenticated from "@/libs/components/layouts/Authenticated";
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import { TransactionHistoryInteface } from "@/libs/Utils/Interfaces";
import SearchActionBar from "./SearchActionBar";
import { ApiGetTransferHistory } from "@/libs/Utils/ApiHelpers";
import FormTransferMoney from "./FormTransferMoney";

function index() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
    setIsModalOpen(false);
  };

  const columns = [
    { name: "DateTime", data: "date", sorting: true, visible: true },
    {
      name: "Sender",
      data: "sender_account_number",
      sorting: true,
      visible: true,
    },
    {
      name: "Recipient",
      data: "recicient_account_number",
      sorting: true,
      visible: true,
    },

    { name: "Currency", data: "Currency", sorting: true, visible: true },
    { name: "Amount", data: "amount", sorting: true, visible: true },
    { name: "status", data: "status", sorting: true, visible: true },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [dataTable, setDataTable] = useState<TransactionHistoryInteface[]>([]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setPage(1);
    setSelectAll(false);
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApiGetTransferHistory();
      if (response && response.data.data) {
        setDataTable(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return (
    <Authenticated>
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
          <div className="mb-4">
            <Breadcrumb className="flex mb-5 mt-3" />
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              Bank Transfer
            </h1>
          </div>
          <SearchActionBar
            searchQuery={searchQuery}
            handleSearchInputChange={handleSearchInputChange}
            handleRefresh={handleRefresh}
            handleAdd={() => {
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col h-100">
        <div className="overflow-x-auto h-64">
          <div className="inline-block min-w-full align-middle max-h-64 overflow-y-auto">
            <Table
              data={dataTable}
              isLoading={isLoading}
              handleSelectAll={() => {}}
              selectAll={selectAll}
              handleSelect={() => {}}
              handleSort={() => {}}
              columns={columns}
              showAction={false}
            />
          </div>
        </div>
      </div>
      <FormTransferMoney
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        callBackRefresh={handleRefresh}
      />
    </Authenticated>
  );
}

export default index;
