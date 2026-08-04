import { useEffect, useMemo } from "react";
import cls from "./SpecsTable.module.css";
import { extractJsonArray } from "@/shared/lib/parseJSON";
import type { Chat } from "@/entities/ChatHistoryItem";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Button from "@/shared/ui/Button/Button";

interface SpecsTableProps {
  chatData: Chat;
  onReset: () => void;
}

const statusPriority: Record<string, number> = {
  Подходит: 1,
  Частично: 2,
  "Не подходит": 3,
};

const SpecsTable = ({ chatData, onReset }: SpecsTableProps) => {
  const [searchParams] = useSearchParams();

  const sortOrder = Number(searchParams.get("sortOrder")) || 0;

  const products = useMemo(() => {
    if (!chatData?.messages) return [];
    const resultMsg = chatData.messages.find((m) => m.stage === "result");
    if (!resultMsg) return [];

    let rawProducts = extractJsonArray(resultMsg.text);

    rawProducts = rawProducts.filter((product) => {
      if (product?.match_status === "Не подходит") {
        return false;
      }

      if (product?.match_status === "Подходит") {
        return true;
      }

      const specs = product?.specifications;

      if (!specs) return false;

      if (Array.isArray(specs)) {
        return specs.length > 0;
      }

      if (typeof specs === "object") {
        return Object.keys(specs).length > 0;
      }

      if (typeof specs === "string") {
        return specs.trim() !== "";
      }

      return false;
    });
    if (sortOrder > 0) {
      rawProducts = [...rawProducts].sort((a, b) => {
        const priorityA = statusPriority[a.match_status] || 99;
        const priorityB = statusPriority[b.match_status] || 99;

        if (sortOrder === 1) return priorityA - priorityB;
        if (sortOrder === 2) return priorityB - priorityA;
        return 0;
      });
    }

    return rawProducts;
  }, [chatData, sortOrder]);

  console.log(products);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("saved_products", JSON.stringify(products));
    }
  }, [products]);

  const downloadExcel = () => {
    const localData = localStorage.getItem("saved_products");
    if (!localData) {
      alert("Нет данных для скачивания!");
      return;
    }

    const rawProducts = JSON.parse(localData);

    const formattedData = rawProducts.map((prod: any) => {
      const specsString = Object.entries(prod.specifications || {})
        .map(([key, value]) => `${key} ${value}`)
        .join("; ");

      return {
        "Название товара": prod.product_name,
        "Статус соответствия": prod.match_status,
        "Несоответствия (Характеристики)": specsString || "Нет изменений",
        "Ссылка на товар": prod.url,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Продукты");

    XLSX.writeFile(workbook, "products_report.xlsx");
  };

  return (
    <div className={cls.resultsWrapper}>
      <header className={cls.resultsHeader}>
        <h2>Результаты поиска</h2>
        <div className={cls.actions}>
          <Button onClick={downloadExcel} className={cls.resetBtn}>
            Скачать Excel 📊
          </Button>
          <Button onClick={onReset} className={cls.resetBtn}>
            Новый поиск
          </Button>
        </div>
      </header>

      <div className={cls.tableContainer}>
        <table className={cls.analogsTable}>
          <thead>
            <tr>
              <th>Наименование</th>
              <th>Характеристики</th>

              <th>Ссылка</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <tr key={idx}>
                  <td className={cls.nameCell}>
                    <strong>
                      {product.product_name
                        ? product.product_name.length > 20
                          ? product.product_name.slice(0, 20) + "..."
                          : product.product_name
                        : "Без названия"}
                    </strong>
                  </td>

                  <td className={cls.specsCell}>
                    {Array.isArray(product.specifications) &&
                    product.specifications.length > 0 ? (
                      <ul className={cls.specsList}>
                        {product.specifications.map((spec, i: number) => {
                          if (typeof spec === "object" && spec !== null) {
                            return Object.entries(spec).map(([key, value]) => (
                              <li key={`${i}-${key}`}>
                                <strong>{key}:</strong> {String(value)}
                              </li>
                            ));
                          }
                          return <li key={i}>{spec}</li>;
                        })}
                      </ul>
                    ) : typeof product.specifications === "object" &&
                      product.specifications !== null &&
                      Object.keys(product.specifications).length > 0 ? (
                      <ul className={cls.specsList}>
                        {Object.entries(product.specifications).map(
                          ([key, value], i) => (
                            <li key={i}>
                              <strong>{key}:</strong> {String(value)}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : typeof product.specifications === "string" &&
                      product.specifications.trim() !== "" ? (
                      <div className={cls.specsText}>
                        {product.specifications}
                      </div>
                    ) : (
                      <span className={cls.noData}>Подходит</span>
                    )}
                  </td>

                  <td className={cls.linkCell}>
                    <a
                      href={
                        product.url?.startsWith("http")
                          ? product.url
                          : `https://${product.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className={cls.shopLink}
                    >
                      В магазин
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={cls.emptyCell}>
                  Товары не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecsTable;
