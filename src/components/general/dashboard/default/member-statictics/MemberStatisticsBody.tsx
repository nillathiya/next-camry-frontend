import { Action, Authors, Company, ImagePath, Progress } from "@/constants";
import { DeleteEditIcon, MembersData } from "@/data/general/dashboard/default";
import Image from "next/image";
import { Input, Table } from "reactstrap";

const MemberStatisticsBody = () => {
  return (
    <div className="ard-body member-datatable p-0">
      <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
        <Table id="member-table" className="datatable-table">
          <thead>
            <tr>
              <th />
              <th>
                <span className="f-light f-w-600">{Authors}</span>
              </th>
              <th>
                <span className="f-light f-w-600">{Company}</span>
              </th>
              <th>
                <span className="f-light f-w-600">{Progress}</span>
              </th>
              <th>
                <span className="f-light f-w-600">{Action}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {MembersData.map((item, i) => (
              <tr key={i}>
                <td>
                  <div className="checkbox-checked">
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        id={item.checkboxId}
                        type="checkbox"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Image
                      src={`${ImagePath}/dashboard/user/${item.author.image}`}
                      alt="user"
                      height={50}
                      width={50}
                    />
                    <div>
                      <h6 className="f-w-500">{item.author.name}</h6>
                      <span className="f-light f-12 f-w-500">
                        {item.author.role}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <h6 className="f-w-500">{item.company}</h6>
                  <span className="f-light f-12 f-w-500">
                    {item.author.role}
                  </span>
                </td>
                <td>
                  <span className="f-w-500 f-12 f-light">{item.progress}%</span>
                  <div
                    className={`progress progress-stripe-${item.color} mt-2`}
                    style={{ height: 5 }}
                  >
                    <div
                      className="progress-bar-animated progress-bar-striped"
                      role="progressbar"
                      style={{ width: item.progress }}
                      aria-valuenow={10}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </td>
                <td>{DeleteEditIcon}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MemberStatisticsBody;
