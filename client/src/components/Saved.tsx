import { useEffect } from "react";
import x from "../assets/x.svg";
import { useDispatch, useSelector } from "react-redux";
import { deleteConversion, fetchConversions } from "../redux/conversionsSlice";
import { AppDispatch, RootState } from "../redux/store";
import { AnimatePresence, motion } from "motion/react";

const Saved = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversions, loading, error } = useSelector((state: RootState) => state.conversions);

  useEffect(() => {
    dispatch(fetchConversions());
  }, [dispatch]);

  const handleDelete = (_id: string) => {
    dispatch(deleteConversion(_id));
  };

  return (
    <div id="saved">
      <div className="container">
        <h2>saved</h2>
        <div className="saved-list">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          <AnimatePresence mode="popLayout">
            {conversions.length > 0 &&
              [...conversions]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((conversion) => {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -25 }}
                      className="saved-list__item"
                      key={conversion._id}
                    >
                      {`${conversion.initialValue} ${conversion.initialUnit} → ${conversion.resultValue} ${conversion.resultUnit}`}
                      <span>
                        <img
                          src={x}
                          alt="delete icon"
                          className="delete-button"
                          onClick={() => handleDelete(conversion._id)}
                        />
                      </span>
                    </motion.div>
                  );
                })}
          </AnimatePresence>
          {!loading && !error && conversions.length === 0 && <p>No saved conversions!</p>}
        </div>
      </div>
    </div>
  );
};

export default Saved;
