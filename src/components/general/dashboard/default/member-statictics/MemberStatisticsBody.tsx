import { API_URL } from "@/api/route";
import {
  Action,
  Authors,
  Company,
  DefaultDirectUserImg,
  ImagePath,
  Progress,
} from "@/constants";
import { DeleteEditIcon, MembersData } from "@/data/general/dashboard/default";
import { formatDate } from "@/lib/dateFormate";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getUserDirectsAsync } from "@/redux-toolkit/slices/userSlice";
import { IUserDirectsQuery } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Input, Table, Spinner, Alert } from "reactstrap";

const MemberStatisticsBody = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { userDirects, loading } = useAppSelector((state) => state.user);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) {
      setError("Please log in to view your directs");
      return;
    }

    try {
      const params: IUserDirectsQuery = {
        userId: session.user.id,
      };
      await dispatch(getUserDirectsAsync(params)).unwrap();
      setError(null);
    } catch (error: any) {
      console.error("Failed to fetch user directs:", error);
      const message =
        error.status === 404
          ? "No directs found"
          : error.message || "Failed to fetch data. Please try again.";
      setError(message);
    }
  }, [dispatch, session?.user?.id]);

  useEffect(() => {
    if (userDirects.length === 0 && !loading) {
      fetchData();
    }
  }, [fetchData, userDirects.length, loading]);

  // Get only 4 latest directs based on createdAt date
  const latestDirects = [...userDirects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  // Determine progress bar color based on rank
  const getProgressColor = (rank: number): string => {
    if (rank >= 8) return "success";
    if (rank >= 5) return "primary";
    if (rank >= 3) return "warning";
    return "secondary";
  };

  return (
    <div className="ard-body member-datatable p-0">
      <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
        {loading ? (
          <div className="text-center py-4">
            <Spinner color="primary" />
          </div>
        ) : error ? (
          <Alert color="danger" className="m-3">
            {error}
          </Alert>
        ) : latestDirects.length === 0 ? (
          <Alert color="info" className="m-3">
            No directs found
          </Alert>
        ) : (
          <Table id="member-table" className="datatable-table">
            <thead>
              <tr>
                <th />
                <th>
                  <span className="f-light f-w-600">{"Direct"}</span>
                </th>
                <th>
                  <span className="f-light f-w-600">{"Progress"}</span>
                </th>
                <th>
                  <span className="f-light f-w-600">{"Join Date"}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {latestDirects.map((user, i) => {
                const progress = user.rank * 10;
                const color = getProgressColor(user.rank);
                return (
                  <tr key={i}>
                    <td>
                      <div className="d-flex gap-2">
                        <Image
                          src={
                            user.profilePicture
                              ? `${API_URL}${user.profilePicture}`
                              : `${ImagePath}${DefaultDirectUserImg}`
                          }
                          alt="user"
                          height={50}
                          width={50}
                        />
                      </div>
                    </td>
                    <td>
                      <h6 className="f-w-500">{user.username || "N/A"}</h6>
                      <span className="f-light f-12 f-w-500">
                        {user.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="f-w-500 f-12 f-light">
                        {progress || 0}%
                      </span>
                      <div
                        className={`progress progress-stripe-${color} mt-2`}
                        style={{ height: 5 }}
                      >
                        <div
                          className="progress-bar-animated progress-bar-striped"
                          role="progressbar"
                          style={{ width: progress }}
                          aria-valuenow={10}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <h6 className="f-w-500">
                          {formatDate(user.createdAt) || "N/A"}
                        </h6>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MemberStatisticsBody;
