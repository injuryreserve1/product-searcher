import { useMemo } from "react";
import cls from "./SpecsTable.module.css";
import { extractJsonArray } from "@/shared/lib/parseJSON";
import type { Chat } from "@/entities/ChatHistoryItem";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const sortOrder = Number(searchParams.get("sortOrder")) || 0;

  const products = useMemo(() => {
    if (!chatData?.messages) return [];

    const resultMsg = chatData.messages.find((m) => m.stage === "result");
    if (!resultMsg) return [];

    let rawProducts = extractJsonArray(resultMsg.text);

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

  const updateSort = () => {
    const currentOrder = Number(searchParams.get("sortOrder")) || 0;
    const newValue = (currentOrder + 1) % 3;

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set("sortOrder", String(newValue));
      return nextParams;
    });
  };

  return (
    <div className={cls.resultsWrapper}>
      <header className={cls.resultsHeader}>
        <h2>Результаты поиска</h2>
        <button onClick={onReset} className={cls.resetBtn}>
          Новый поиск
        </button>
      </header>

      <div className={cls.tableContainer}>
        <table className={cls.analogsTable}>
          <thead>
            <tr>
              <th>Наименование</th>
              <th>Характеристики</th>
              <th onClick={updateSort}>
                Статус
                <span className={cls.sortIcon}>
                  {sortOrder === 1 ? " 🔽" : sortOrder === 2 ? " 🔼" : " ↕️"}
                </span>
              </th>
              <th>Ссылка</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <tr key={idx}>
                  <td className={cls.nameCell}>
                    <strong>
                      {product.product_name.slice(0, 20) + "..."}{" "}
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

                  <td className={cls.statusCell}>
                    <span className={cls.statusBadge}>
                      {typeof product.match_status === "string"
                        ? product.match_status
                        : "—"}
                    </span>
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
                <td colSpan={4} className={cls.emptyCell}>
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
