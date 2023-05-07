import React from "react";
import "./index.css";
export default function Room724() {
  return (
    <div className="box">
      <div className="room">
        <div className="first">
          <div className="row">
            <div className="block left">
              <button>
                <div className="teacher">权义宁</div>
                <div className="seatNum">41</div>
              </button>
              <button>
                <div className="teacher">权义宁</div>
                <div className="seatNum">42</div>
              </button>
              <button>
                <div className="teacher">权义宁</div>
                <div className="seatNum">43</div>
              </button>
              <button>
                <div className="teacher">权义宁</div>
                <div className="seatNum">44</div>
              </button>
            </div>
            <div className="block right">
              <button>学生1</button>
              <button>学生2</button>
              <button>学生3</button>
              <button>学生4</button>
            </div>
          </div>
          <div className="row clearfix">
            <div className="block left">
              <button>
                <div className="student">黄纾学</div>
                <div className="teacher">权义宁</div>
                <div className="grade">研二</div>
                <div className="seatNum">23</div>
              </button>
              <button>
                <div className="student">江涛</div>
                <div className="teacher">权义宁</div>
                <div className="grade">研二</div>
                <div className="seatNum">24</div>
              </button>
              <button>
                <div className="teacher">权义宁</div>
                <div className="seatNum">33</div>
              </button>
              <button>
                <div className="teacher">权义宁</div>
                <div className="seatNum">34</div>
              </button>
            </div>
            <div className="block right">
              <button>学生1</button>
              <button>学生2</button>
              <button>学生3</button>
              <button>学生4</button>
            </div>
          </div>
        </div>
        <div className="second">
          <div className="row clearfix">
            <div className="block left">
              <button>学生1</button>
              <button>学生2</button>
              <button>学生3</button>
              <button>学生4</button>
            </div>
            <div className="block right">
              <button>学生1</button>
              <button>学生2</button>
              <button>学生3</button>
              <button>学生4</button>
            </div>
          </div>
          <div className="row clearfix">
            <div className="block left">
              <button>学生1</button>
              <button>学生2</button>
              <button>学生3</button>
              <button>学生4</button>
            </div>
            <div className="block right">
              <button>学生1</button>
              <button>学生2</button>
              <button>学生3</button>
              <button>学生4</button>
            </div>
          </div>
        </div>
      </div>
      <div className="door leftDoor"></div>
      <div className="door rightDoor"></div>
    </div>
  );
}
